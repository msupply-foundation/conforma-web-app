import React, { useEffect, useState } from 'react'
import { ErrorBoundary, pluginProvider } from '.'
import { ApplicationViewWrapperProps, PluginComponents, ValidationState } from './types'
import { useUpdateResponseMutation } from '../utils/generated/graphql'
import {
  EvaluatorNode,
  EvaluatorParameters,
  LooseString,
  ResponseFull,
  ElementPluginParameters,
} from '../utils/types'
import { useUserState } from '../contexts/UserState'
import validate from './defaultValidate'
import evaluateExpression, { isEvaluationExpression } from '@openmsupply/expression-evaluator'
import { isEqual } from 'lodash'
import { Form, Icon } from 'semantic-ui-react'
import Markdown from '../utils/helpers/semanticReactMarkdown'
import { useFormElementUpdateTracker } from '../contexts/FormElementUpdateTrackerState'
import { useLanguageProvider } from '../contexts/Localisation'
import globalConfig from '../config'
import { SemanticICONS } from 'semantic-ui-react'
import getServerUrl from '../utils/helpers/endpoints/endpointUrlBuilder'
import functions from '../components/FigTreeEvaluator/customFunctions'

const graphQLEndpoint = getServerUrl('graphQL')

export const DEFAULT_LOADING_VALUE = 'Loading...'

const ApplicationViewWrapper: React.FC<ApplicationViewWrapperProps> = (props) => {
  const { t } = useLanguageProvider()
  const calculateValidationState = useCalculateValidationState()
  const [responseMutation] = useUpdateResponseMutation()
  const { element, isStrictPage, changesRequired, currentResponse, allResponses, applicationData } =
    props

  const {
    code,
    pluginCode,
    parameters,
    isVisible,
    isRequired,
    validationExpression,
    validationMessage,
  } = element

  const isValid = currentResponse?.isValid || true

  const isInnerFormElement = !!props.onSaveUpdateMethod
  // Default update method is a mutation
  const onSaveUpdateMethod = props.onSaveUpdateMethod || responseMutation

  const stageNumber = applicationData.current.stage.number

  const { setState: setUpdateTrackerState } = useFormElementUpdateTracker()

  const {
    userState: { currentUser },
  } = useUserState()
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid,
  })
  const [evaluatedParameters, setEvaluatedParameters] = useState<{ [key: string]: any }>({})

  const { ApplicationView, config }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  const parameterLoadingValues = config?.parameterLoadingValues
  const internalParameters = config?.internalParameters || []
  const [simpleParameters, parameterExpressions] = buildParameters(
    parameters,
    parameterLoadingValues,
    internalParameters
  )

  // Update dynamic parameters when responses change
  useEffect(() => {
    const JWT = localStorage.getItem(globalConfig.localStorageJWTKey)
    Object.entries(parameterExpressions).forEach(([field, expression]) => {
      evaluateExpression(expression as EvaluatorNode, {
        objects: { responses: allResponses, currentUser, applicationData, functions },
        APIfetch: fetch,
        graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
        headers: { Authorization: 'Bearer ' + JWT },
      }).then((result: any) => {
        // Need to do our own equality check since React treats 'result' as
        // different object to original and causes a re-render even when not
        // really changed
        if (!isEqual(result, evaluatedParameters?.[field])) {
          setEvaluatedParameters((prevState) => ({ ...prevState, [field]: result }))
        }
      })
    })
  }, [allResponses])

  useEffect(() => {
    onUpdate(currentResponse?.text)
  }, [currentResponse, isStrictPage])

  const onUpdate = async (value: LooseString) => {
    const JWT = localStorage.getItem(globalConfig.localStorageJWTKey)
    const responses = { thisResponse: value, ...allResponses }
    const newValidationState = await calculateValidationState({
      validationExpression,
      validationMessage,
      isRequired,
      isStrictPage,
      responses,
      evaluationParameters: {
        objects: { responses, currentUser, applicationData, functions },
        APIfetch: fetch,
        graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
        headers: { Authorization: 'Bearer ' + JWT },
      },
      currentResponse,
    })
    setValidationState(newValidationState)
    return newValidationState
  }

  const onSave = async (response: ResponseFull) => {
    if (!response?.customValidation) {
      // Validate and Save response -- generic
      const validationResult: ValidationState = await onUpdate(response?.text)
      if (response?.text !== undefined)
        await onSaveUpdateMethod({
          variables: {
            id: currentResponse?.id as number,
            value: response,
            isValid: validationResult.isValid,
            stageNumber,
            evaluatedParameters: { ...simpleParameters, ...evaluatedParameters },
          },
        })
      if (response === null || response?.text == undefined)
        // Reset response if cleared
        await onSaveUpdateMethod({
          variables: {
            id: currentResponse?.id as number,
            value: null,
            isValid: null,
            stageNumber,
          },
        })
      notifyTrackerElementUpdated(response?.text)
    } else {
      // Save response for plugins with internal validation
      const { isValid, validationMessage } = response.customValidation
      setValidationState({ isValid, validationMessage })
      delete response.customValidation // Don't want to save this field
      await onSaveUpdateMethod({
        variables: {
          id: currentResponse?.id as number,
          value: response,
          isValid,
          stageNumber,
        },
      })
      notifyTrackerElementUpdated(response?.text)
    }
  }

  // Tells application state that plugin field was updated
  const notifyTrackerElementUpdated = (textValue?: string | null) => {
    // Avoid tracking changes for inner elements
    if (isInnerFormElement) return
    setUpdateTrackerState({
      type: 'setElementUpdated',
      elementCode: code,
      textValue: textValue || '',
      previousValue: currentResponse?.text || '',
    })
  }

  // Tells application state that plugin field is in focus
  const notifyTrackerElementEntered = (textValue?: string | null) => {
    // Avoid tracking changes for inner elements
    if (isInnerFormElement) return
    setUpdateTrackerState({
      type: 'setElementEntered',
      elementCode: code,
      textValue: textValue || '',
    })
  }

  const setIsActive = () => {
    notifyTrackerElementEntered(currentResponse?.text)
  }

  if (!pluginCode || !isVisible) return null

  const PluginComponent = (
    <ApplicationView
      onUpdate={onUpdate}
      onSave={onSave}
      {...props}
      {...element}
      parameters={{ ...simpleParameters, ...evaluatedParameters }}
      setIsActive={setIsActive}
      Markdown={Markdown}
      validationState={validationState || { isValid: true }}
      validate={validate}
      getDefaultIndex={getDefaultIndex}
    />
  )

  const {
    isChangeRequest = false,
    isChanged = false,
    reviewerComment = t('APPLICATION_OTHER_CHANGES_MADE'),
  } = changesRequired || {}

  const getChangeRequestClassesAndIcon = () => {
    const isValid = validationState ? (validationState.isValid as boolean) : true
    if (!isValid) return
    if (isChangeRequest && isChanged)
      return {
        extraClasses: 'changes change-request-changed',
        iconName: 'comment alternate outline',
      }
    if (isChangeRequest && !isChanged)
      return { extraClasses: 'changes change-request-unchanged', iconName: 'exclamation circle' }
    // Updated withouth change request
    if (isChanged) return { extraClasses: 'changes updated', iconName: 'info circle' }
    return
  }

  const { extraClasses = '', iconName = '' } = getChangeRequestClassesAndIcon() || {}

  return (
    <ErrorBoundary pluginCode={pluginCode}>
      <React.Suspense fallback="Loading Plugin">
        <Form.Field className={`element-application-view ${extraClasses}`} required={isRequired}>
          {PluginComponent}
          <ChangesComment reviewerComment={reviewerComment} iconName={iconName} />
        </Form.Field>
      </React.Suspense>
    </ErrorBoundary>
  )
}

interface ChangesCommentProps {
  reviewerComment: string
  iconName: string
}

const ChangesComment: React.FC<ChangesCommentProps> = ({ reviewerComment, iconName }) => (
  <>
    {/* reviewer-comment is only visibility when parent class matches ".element-application-view.changes" */}
    <p className="reviewer-comment">
      <Icon name={iconName as SemanticICONS} />
      {reviewerComment}
    </p>
  </>
)

export default ApplicationViewWrapper

/* 
Allows the default value in template to be either an index or string
value. Number is assumed to be index, else it returns the index of the 
specified value in the options array. Functions is passed as prop to
element plug-ins so can be used by any plugin.
*/
const getDefaultIndex = (defaultOption: string | number, options: string[]): number => {
  if (typeof defaultOption === 'number') {
    return defaultOption
  } else return options.indexOf(defaultOption)
}

export const buildParameters = (
  parameters: ElementPluginParameters,
  parameterLoadingValues: any,
  internalParameters: string[]
) => {
  const simpleParameters: any = {}
  const parameterExpressions: any = {}
  for (const [key, value] of Object.entries(parameters)) {
    if (internalParameters.includes(key)) simpleParameters[key] = value
    else if (isEvaluationExpression(value)) {
      parameterExpressions[key] = value
      simpleParameters[key] = parameterLoadingValues?.[key] ?? DEFAULT_LOADING_VALUE
    } else simpleParameters[key] = value
  }
  return [simpleParameters, parameterExpressions]
}

const useCalculateValidationState = () => {
  const { t } = useLanguageProvider()

  const calculateValidationState = async ({
    validationExpression,
    validationMessage,
    isRequired,
    isStrictPage,
    responses,
    evaluationParameters,
    currentResponse,
  }: {
    validationExpression: EvaluatorNode | undefined
    validationMessage: string | null | undefined
    isRequired: boolean | undefined
    isStrictPage: boolean | undefined
    responses: any // thisResponse field makes it not "ResponsesByCode"
    evaluationParameters: EvaluatorParameters
    currentResponse: ResponseFull | null
  }) => {
    const validationResult = validationExpression
      ? await validate(validationExpression, validationMessage as string, evaluationParameters)
      : { isValid: true }

    if (!validationResult.isValid && currentResponse?.text !== undefined) return validationResult
    // !responses.thisResponse, check for null, undefined, empty string
    if (isRequired && isStrictPage && !responses?.thisResponse)
      return {
        isValid: false,
        validationMessage: validationMessage || t('VALIDATION_REQUIRED_ERROR'),
      }
    return { isValid: true }
  }

  return calculateValidationState
}
