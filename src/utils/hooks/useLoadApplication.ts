import { useEffect, useState } from 'react'
import {
  ApplicationDetails,
  ElementBase,
  EvaluatedElement,
  FullStructure,
  LevelDetails,
  StageDetails,
  TemplateDetails,
  UseGetApplicationProps,
} from '../types'
import evaluate from '@openmsupply/expression-evaluator'
import { useUserState } from '../../contexts/UserState'
import { EvaluatorParameters } from '../types'
import {
  ApplicationStageStatusAll,
  ApplicationStatus,
  Organisation,
  TemplateElement,
  TemplateElementCategory,
  TemplateSection,
  TemplateStage,
  TemplateStageReviewLevel,
  useGetApplicationQuery,
  User,
} from '../generated/graphql'
import { useLanguageProvider } from '../../contexts/Localisation'
import { buildSectionsStructure } from '../helpers/structure'
import config from '../../config'
import { getSectionDetails } from '../helpers/application/getSectionsDetails'
import translate from '../../utils/helpers/structure/replaceLocalisedStrings'
import useTriggers from './useTriggers'

const graphQLEndpoint = config.serverGraphQL
const JWT = localStorage.getItem(config.localStorageJWTKey)

const useLoadApplication = ({ serialNumber, networkFetch }: UseGetApplicationProps) => {
  const { strings, selectedLanguage } = useLanguageProvider()
  const [isLoading, setIsLoading] = useState(true)
  const [structureError, setStructureError] = useState('')
  const [structure, setFullStructure] = useState<FullStructure>()
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    ready: triggersReady,
    loading: triggersLoading,
    error: triggersError,
    recheckTriggers,
  } = useTriggers(serialNumber)

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: serialNumber,
      langCode: selectedLanguage.code,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !triggersReady,
  })

  useEffect(() => {
    if (triggersError) {
      setStructureError(strings.ERROR_TRIGGER)
      console.error('Trigger error:', triggersError)
      return
    }

    if (loading || triggersLoading) {
      setIsLoading(true)
      return
    }

    if (!triggersReady || !data) return

    const templateLanguageStrings =
      data?.applicationBySerial?.template?.customLocalisations?.nodes[0]?.strings ?? {}

    const translatedData = translate(data, templateLanguageStrings)

    const application = translatedData.applicationBySerial

    // No unexpected error - just a application not accessible to user (Show 404 page)
    if (!application) {
      setIsLoading(false)
      return
    }

    if (!application.template) {
      setStructureError(strings.APPLICATION_MISSING_TEMPLATE)
      return
    }

    // Building the structure...
    setIsLoading(true)

    const sections = (application?.template?.templateSections?.nodes || []) as TemplateSection[]
    const sectionDetails = getSectionDetails(sections)

    const stages = translatedData.applicationStageStatusLatests
      ?.nodes as ApplicationStageStatusAll[]
    if (stages.length > 1) console.log('StageStatusAll More than one results for 1 application!')
    const {
      stageId,
      stage,
      stageColour,
      stageNumber,
      status,
      statusHistoryTimeCreated,
      stageHistoryTimeCreated,
    } = stages[0] // Should only have one result

    const applicationDetails: ApplicationDetails = {
      id: application.id,
      template: application.template as TemplateDetails,
      isLinear: application.template?.isLinear as boolean,
      serial: application.serial as string,
      name: application.name as string,
      outcome: application.outcome as string,
      current: {
        stage: {
          id: stageId as number,
          name: stage as string,
          number: stageNumber as number,
          colour: stageColour as string,
        },
        status: status as ApplicationStatus,
        timeStageCreated: stageHistoryTimeCreated,
        timeStatusCreated: statusHistoryTimeCreated,
      },
      firstStrictInvalidPage: null,
      isChangeRequest: false,
      user: application?.user as User,
      org: application?.org as Organisation,
      config,
    }

    const baseElements: ElementBase[] = []
    sections.forEach((section) => {
      let pageCount = 1
      const elementsInSection = section?.templateElementsBySectionId?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        if (element.elementTypePluginCode === 'pageBreak') pageCount++
        else
          baseElements.push({
            category: element.category || TemplateElementCategory.Information,
            id: element.id,
            code: element.code,
            pluginCode: element.elementTypePluginCode || '',
            sectionIndex: section?.index || 0,
            sectionCode: section?.code || '',
            elementIndex: element.index || 0,
            page: pageCount,
            isEditableExpression: element.isEditable,
            isRequiredExpression: element.isRequired,
            isVisibleExpression: element.visibilityCondition,
            parameters: element.parameters,
            validationExpression: element.validation,
            validationMessage: element.validationMessage || '',
            helpText: element.helpText || '',
            title: element.title || '',
            defaultValueExpression: element.defaultValue,
            ...defaultEvaluatedElement,
          })
      })
    })

    const canApplicantMakeChanges = application.template?.canApplicantMakeChanges ?? true

    const templateStages = application.template?.templateStages.nodes as TemplateStage[]

    const evaluatorParams: EvaluatorParameters = {
      objects: { currentUser, applicationData: applicationDetails },
      APIfetch: fetch,
      graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
      headers: { Authorization: 'Bearer ' + JWT },
    }

    const getStageAndLevels = (stage: TemplateStage) => {
      const stageLevels =
        (stage.templateStageReviewLevelsByStageId?.nodes as TemplateStageReviewLevel[]) || []
      return {
        stage: {
          id: stage.id,
          name: stage.title as string,
          number: stage.number as number,
          description: stage.description ? stage.description : undefined,
          colour: stage.colour as string,
        },
        levels: stageLevels.map(({ name: levelName, number: levelNumber }) => ({
          name: levelName as string,
          number: levelNumber as number,
        })),
      }
    }

    evaluate(application.template?.startMessage || '', evaluatorParams).then((startMessage) => {
      let newStructure: FullStructure = {
        info: {
          ...applicationDetails,
          submissionMessage: application.template?.submissionMessage,
          startMessage: startMessage as string,
        },
        stages: templateStages.map((stage) => getStageAndLevels(stage)),
        sections: buildSectionsStructure({ sectionDetails, baseElements, page: strings.PAGE }),
        canApplicantMakeChanges,
        attemptSubmission: false,
        reload: reloadApplication,
      }

      setFullStructure(newStructure)
      setIsLoading(false)
    })
  }, [data, loading, triggersReady, triggersLoading, triggersError])

  const reloadApplication = async () => {
    console.log('Reloading...')
    recheckTriggers()
  }

  return {
    error: structureError || error?.message,
    isLoading: loading || isLoading,
    structure,
    reloadApplication,
  }
}

export const defaultEvaluatedElement: EvaluatedElement = {
  isEditable: true,
  isRequired: true,
  isVisible: true,
  isValid: undefined,
  defaultValue: null,
}

export default useLoadApplication
