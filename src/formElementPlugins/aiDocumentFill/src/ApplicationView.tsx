import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { Icon, Message, Segment, Transition } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { PluginProvider } from '../../pluginProvider'
import { TranslatePluginMethod, useLanguageProvider } from '../../../contexts/Localisation'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { useUserState } from '../../../contexts/UserState'
import { useApplicationStructure } from '../../../contexts/ApplicationStructure'
import { UploadButton } from '../../../components/common'
import { RequestError } from '../../../utils/helpers/fetchMethods'
import { FullStructure } from '../../../utils/types'
import { buildElements, FillTarget } from './buildElements'
import { extractAnswers } from './extractAnswers'
import { FillModal, FillState, Proposal } from './FillModal'
import { previewFill } from './previewFill'
import { ResponseUpdate, writeResponses } from './writeResponses'
import { ExtractionAnswer } from './types'

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
  const { getPluginTranslator, selectedLanguage } = useLanguageProvider()
  const t = getPluginTranslator('aiDocumentFill')
  const apolloClient = useApolloClient()
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
  // Response texts just saved, by element code, until the structure has them
  const awaitedTexts = useRef<Record<string, string> | null>(null)

  // Elements on the page only show their new responses once remounted, which
  // has to wait for the rebuilt structure: remounting earlier shows the old
  // values. That remounts this element too, closing the modal.
  useEffect(() => {
    const expected = awaitedTexts.current
    if (!expected || !applicationStructure) return
    const responses = applicationStructure.structure.responsesByCode ?? {}
    if (!Object.entries(expected).every(([code, text]) => responses[code]?.text === text)) return
    awaitedTexts.current = null
    applicationStructure.requestRevalidation?.()
    applicationStructure.remountElements()
  }, [applicationStructure])

  // How the application would be with these proposals applied
  const preview = useCallback(
    (proposals: Proposal[], codes: string[] = []) =>
      previewFill(
        applicationStructure?.structure as FullStructure,
        currentUser,
        proposals.map(({ target, response }) => ({ code: target.definition.code, response })),
        codes
      ),
    [applicationStructure, currentUser]
  )

  const getVisibleCodes = useCallback(
    async (selected: Proposal[]) => {
      if (fillState?.status !== 'review') return new Set<string>()
      const codes = fillState.proposals.map(({ target }) => target.definition.code)
      return (await preview(selected, codes)).visibleCodes
    },
    [fillState, preview]
  )

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
      const targets = await buildElements(structure, currentUser, scope)
      if (targets.length === 0) {
        setFillState({ status: 'error', message: t('ERROR_NO_QUESTIONS') })
        return
      }
      const { answers } = await extractAnswers({
        files,
        elements: targets.map(({ definition }) => definition),
        applicationSerial: structure.info.serial,
        instructions,
      })
      const proposals = getProposals(targets, answers)
      // Existing answers are only replaced if the applicant chooses to
      const selected = proposals.filter(({ target }) => !target.definition.currentValue)
      const codes = proposals.map(({ target }) => target.definition.code)
      const { visibleCodes } = await preview(selected, codes)
      setFillState({
        status: 'review',
        documents: files.map(({ name }) => name),
        proposals,
        selected,
        visibleCodes,
      })
    } catch (err) {
      setFillState({ status: 'error', message: getRequestErrorMessage(err, t) })
    }
  }

  // Answers the elements can't take (not an option, outside their limits) are
  // left out
  const getProposals = (targets: FillTarget[], answers: Record<string, ExtractionAnswer>) =>
    targets.flatMap((target): Proposal[] => {
      const { definition, pluginCode, parameters } = target
      const answer = answers[definition.code]
      if (!answer) return []
      const response = PluginProvider[pluginCode].aiFill?.fromPlainValue(answer.value, parameters, {
        locale: selectedLanguage.locale,
        t: getPluginTranslator(pluginCode),
      })
      if (!response) {
        console.log(`AI document fill: answer doesn't fit ${definition.code}`, answer.value)
        return []
      }
      return [{ target, response, confidence: answer.confidence, evidence: answer.evidence }]
    })

  const handleApply = async (chosen: Proposal[]) => {
    if (!applicationStructure || fillState?.status !== 'review') return
    const { documents } = fillState
    const { structure } = applicationStructure

    const fillRecord = {
      text: documents.join(', '),
      documents,
      filledAt: new Date().toISOString(),
      answerCount: chosen.length,
    }
    const updates: ResponseUpdate[] = chosen.map(({ target, response }) => ({
      id: target.responseId,
      value: response,
      // Revalidated below, once the structure has the new values
      isValid: null,
      evaluatedParameters: target.parameters,
    }))
    const expectedTexts: Record<string, string> = Object.fromEntries(
      chosen.map(({ target, response }) => [target.definition.code, response.text])
    )

    setFillState({ status: 'applying' })
    // Saved as the getValues elements would save them when next shown, so the
    // form shows the questions the answers reveal straight away
    let computedValues
    try {
      computedValues = (await preview(chosen)).computedValues
    } catch (err) {
      console.log('AI document fill: computing values failed', err)
      setFillState({ status: 'error', message: t('ERROR_SAVING_FAILED') })
      return
    }
    for (const { code, responseId, response, parameters } of computedValues) {
      updates.push({
        id: responseId,
        value: response,
        isValid: null,
        evaluatedParameters: parameters,
      })
      expectedTexts[code] = response.text
    }
    if (currentResponse?.id) {
      updates.push({
        id: currentResponse.id,
        value: fillRecord,
        isValid: true,
        evaluatedParameters: parameters,
      })
      expectedTexts[element.code] = fillRecord.text
    }

    awaitedTexts.current = expectedTexts
    try {
      await writeResponses(apolloClient, updates, structure.info.current.stage.number)
    } catch (err) {
      console.log('AI document fill: saving answers failed', err)
      awaitedTexts.current = null
      setFillState({ status: 'error', message: t('ERROR_SAVING_FAILED') })
    }
  }

  return (
    <>
      <FillModal
        state={fillState}
        t={t}
        getVisibleCodes={getVisibleCodes}
        onApply={handleApply}
        onClose={() => setFillState(null)}
      />
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
