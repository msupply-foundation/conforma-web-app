import React, { useState } from 'react'
import { Icon, Message, Segment, Transition } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { TranslatePluginMethod, useLanguageProvider } from '../../../contexts/Localisation'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { useUserState } from '../../../contexts/UserState'
import { useApplicationStructure } from '../../../contexts/ApplicationStructure'
import { UploadButton } from '../../../components/common'
import { RequestError } from '../../../utils/helpers/fetchMethods'
import { buildElements } from './buildElements'
import { extractAnswers } from './extractAnswers'
import { FillModal, FillState } from './FillModal'

// Limits of the server's /api/ai/extract endpoint, checked here so the
// applicant hears about them before anything is sent
const MAX_FILES = 5
const MAX_TOTAL_SIZE_MB = 20
const FILE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif']
// iPhone photos, which the AI service doesn't accept
const HEIC_EXTENSIONS = ['heic', 'heif']

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  currentResponse,
  Markdown,
}) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('aiDocumentFill')
  const { aiEnabled } = usePrefs()
  const {
    userState: { currentUser },
  } = useUserState()
  const applicationStructure = useApplicationStructure()
  const { isEditable } = element
  const { label, description, notice = t('DEFAULT_NOTICE'), instructions, scope } = parameters

  const [error, setError] = useState<string>()
  const [errorVisible, setErrorVisible] = useState(false)
  const [fillState, setFillState] = useState<FillState | null>(null)

  // The server has no API key, so the template's opt-in can't be used here
  if (!aiEnabled) return null

  const showError = (error: string) => {
    setError(error)
    setErrorVisible(true)
    setTimeout(() => setErrorVisible(false), 3000)
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    // Lets the same files be chosen again, e.g. after an error
    e.target.value = ''
    if (files.length === 0 || !applicationStructure) return

    const error = getFilesError(files, t)
    if (error) {
      showError(error)
      return
    }

    setFillState({ status: 'reading' })
    try {
      const { structure } = applicationStructure
      const elements = await buildElements(structure, currentUser, scope)
      if (elements.length === 0) {
        setFillState({ status: 'error', message: t('ERROR_NO_QUESTIONS') })
        return
      }
      const { answers } = await extractAnswers({
        files,
        elements,
        applicationSerial: structure.info.serial,
        instructions,
      })
      setFillState({
        status: 'review',
        documents: files.map(({ name }) => name),
        elements,
        answers,
      })
    } catch (err) {
      setFillState({ status: 'error', message: getRequestErrorMessage(err, t) })
    }
  }

  const handleApply = (codes: string[]) => {
    // TO-DO: write the chosen answers to their responses, then save
    // { text, documents, filledAt, answerCount } as this element's response
    console.log('AI document fill: apply', codes)
    setFillState(null)
  }

  return (
    <>
      <FillModal state={fillState} t={t} onApply={handleApply} onClose={() => setFillState(null)} />
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Message info size="small" icon>
        <Icon name="info circle" />
        <Message.Content>
          <Markdown text={notice} />
        </Message.Content>
      </Message>
      <Segment.Group>
        <Segment basic textAlign="center">
          <UploadButton
            primary
            multiple
            disabled={!isEditable || !applicationStructure}
            handleFiles={handleFiles}
          >
            <Icon name="upload" />
            {t('BUTTON_CHOOSE_DOCUMENTS')}
          </UploadButton>
          {currentResponse?.documents && (
            <p style={{ marginTop: 10 }}>
              <Icon name="check" color="green" />
              {t('FILLED_FROM', {
                count: currentResponse.answerCount ?? 0,
                documents: currentResponse.text,
              })}
            </p>
          )}
        </Segment>
        <Transition visible={errorVisible} duration={{ hide: 500, show: 200 }}>
          <p
            className="error-colour"
            style={{ position: 'absolute', bottom: 3, width: '100%', textAlign: 'center' }}
          >
            {error}
          </p>
        </Transition>
      </Segment.Group>
      <p className="smaller-text" style={{ padding: 5, marginTop: -10 }}>
        {`${t('ALLOWED_FORMATS')} ${FILE_EXTENSIONS.map((f) => '.' + f).join(', ')}`}
        <br />
        {t('LIMITS', { maxFiles: MAX_FILES, maxSize: MAX_TOTAL_SIZE_MB })}
      </p>
    </>
  )
}

// The server's messages are for developers; the applicant gets one by status
const getRequestErrorMessage = (err: unknown, t: TranslatePluginMethod) => {
  switch (err instanceof RequestError ? err.status : undefined) {
    case 404:
      return t('ERROR_NOT_AVAILABLE')
    case 409:
      return t('ERROR_NOT_EDITABLE')
    case 413:
      return t('ERROR_FILES_TOO_BIG')
    case 429:
      return t('ERROR_BUSY')
    default:
      return t('ERROR_READING_FAILED')
  }
}

// The files are sent together, so any problem with one rejects them all
const getFilesError = (files: File[], t: TranslatePluginMethod) => {
  const extensions = files.map(({ name }) => name.split('.').pop()?.toLowerCase() ?? '')
  const totalBytes = files.reduce((total, { size }) => total + size, 0)

  if (extensions.some((extension) => HEIC_EXTENSIONS.includes(extension)))
    return t('ERROR_HEIC_NOT_SUPPORTED')
  if (extensions.some((extension) => !FILE_EXTENSIONS.includes(extension)))
    return t('ERROR_FILE_TYPE_NOT_PERMITTED')
  if (files.length > MAX_FILES) return t('ERROR_TOO_MANY_FILES')
  if (totalBytes > MAX_TOTAL_SIZE_MB * 1024 * 1024) return t('ERROR_FILES_TOO_BIG')
  return null
}

export default ApplicationView
