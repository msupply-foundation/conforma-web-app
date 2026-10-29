import React, { useState } from 'react'
import { Icon, Message, Segment, Transition } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { TranslatePluginMethod, useLanguageProvider } from '../../../contexts/Localisation'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { UploadButton } from '../../../components/common'

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
  const { isEditable } = element
  const { label, description, notice = t('DEFAULT_NOTICE') } = parameters

  const [error, setError] = useState<string>()
  const [errorVisible, setErrorVisible] = useState(false)

  // The server has no API key, so the template's opt-in can't be used here
  if (!aiEnabled) return null

  const showError = (error: string) => {
    setError(error)
    setErrorVisible(true)
    setTimeout(() => setErrorVisible(false), 3000)
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    // Lets the same files be chosen again, e.g. after an error
    e.target.value = ''
    if (files.length === 0) return

    const error = getFilesError(files, t)
    if (error) {
      showError(error)
      return
    }
    // TO-DO: send the documents and element definitions to /api/ai/extract,
    // show the proposed answers for review, and when the applicant applies
    // them, save { text, documents, filledAt, answerCount } as this response
  }

  return (
    <>
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
          <UploadButton primary multiple disabled={!isEditable} handleFiles={handleFiles}>
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
