import { useEffect, useState } from 'react'
import {
  ApplicationDetails,
  ElementBaseNEW,
  FullStructure,
  TemplateDetails,
  TemplateElementStateNEW,
  UseGetApplicationProps,
} from '../types'
import { getApplicationSections } from '../helpers/application/getSectionsDetails'
import { buildSectionsStructure } from '../helpers/structure/buildSectionsStructureNEW'
import {
  Application,
  ApplicationSection,
  ApplicationStageStatusAll,
  ApplicationStatus,
  Template,
  TemplateElement,
  TemplateStage,
  useGetApplicationNewQuery,
} from '../generated/graphql'
import messages from '../messages'
import { DateTime } from 'luxon'
import useEvaluateMessage from './useEvaluateMessage'

const MAX_REFETCH = 10

const useLoadApplication = ({
  currentUser,
  serialNumber,
  networkFetch,
}: UseGetApplicationProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<string>()
  const [shouldEvaluate, setShouldEvaluate] = useState(true)
  const [structureError, setStructureError] = useState('')
  const [structure, setFullStructure] = useState<FullStructure>()
  const [template, setTemplate] = useState<TemplateDetails>()
  const [refetchAttempts, setRefetchAttempts] = useState(0)

  const { data, loading, error, refetch } = useGetApplicationNewQuery({
    variables: {
      serial: serialNumber,
    },
    fetchPolicy: networkFetch ? 'network-only' : 'cache-first',
    notifyOnNetworkStatusChange: true,
  })

  const { evaluatedMessage, isMessageEvaluated } = useEvaluateMessage({
    currentUser,
    message,
    shouldEvaluate,
  })

  useEffect(() => {
    if (!data || loading) return
    const application = data.applicationBySerial as Application

    // No unexpected error - just a application not accessible to user (Show 404 page)
    if (!application) {
      setIsLoading(false)
      return
    }

    if (!application.template) {
      setStructureError(messages.APPLICATION_MISSING_TEMPLATE)
      return
    }

    // Building the structure...
    setIsLoading(true)

    // Checking if trigger is running before loading current status
    if (application.trigger === null) {
      setRefetchAttempts(0)
    } else {
      if (refetchAttempts < MAX_REFETCH) {
        setTimeout(() => {
          console.log('Will refetch loadApplication', refetchAttempts) // TODO: Remove log
          setRefetchAttempts(refetchAttempts + 1)
          refetch()
        }, 500)
      } else setStructureError(messages.APPLICATION_TRIGGER_RUNNING)
      return
    }

    const { id, code, name, isLinear, submissionMessage } = application.template as Template

    setTemplate({
      id,
      code,
      name: name as string,
    })

    if (!submissionMessage) setShouldEvaluate(false)
    else setMessage(submissionMessage)

    const applicationSection = application.applicationSections.nodes as ApplicationSection[]
    const sections = getApplicationSections(applicationSection)

    const stages = data.applicationStageStatusLatests?.nodes as ApplicationStageStatusAll[]
    if (stages.length > 1) console.log('StageStatusAll More than one results for 1 application!')
    const { stageId, stage, status, statusHistoryTimeCreated } = stages[0] // Should only have one result

    const applicationDetails: ApplicationDetails = {
      id: application.id,
      type: name as string,
      isLinear: isLinear as boolean,
      serial: application.serial as string,
      name: application.name as string,
      outcome: application.outcome as string,
      current: {
        stage: {
          id: stageId as number,
          name: stage as string,
        },
        status: status as ApplicationStatus,
        date: DateTime.fromISO(statusHistoryTimeCreated),
      },
      firstStrictInvalidPage: null,
    }

    const baseElements: ElementBaseNEW[] = []
    application.applicationSections.nodes.forEach((sectionNode) => {
      let pageCount = 1
      const elementsInSection = sectionNode?.templateSection?.templateElementsBySectionId
        ?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        if (element.elementTypePluginCode === 'pageBreak') pageCount++
        else
          baseElements.push({
            // ...element,
            category: element.category,
            id: element.id,
            code: element.code,
            pluginCode: element.elementTypePluginCode,
            sectionIndex: sectionNode?.templateSection?.index,
            sectionCode: sectionNode?.templateSection?.code,
            elementIndex: element.index,
            page: pageCount,
            isEditableExpression: element.isEditable,
            isRequiredExpression: element.isRequired,
            isVisibleExpression: element.visibilityCondition,
            parameters: element.parameters,
            validationExpression: element.validation,
            validationMessage: element.validationMessage,
          } as TemplateElementStateNEW)
      })
    })

    const templateStages = application.template?.templateStages.nodes as TemplateStage[]

    setFullStructure({
      info: applicationDetails,
      stages: templateStages.map((stage) => ({
        number: stage.number as number,
        title: stage.title as string,
        description: stage.description ? stage.description : undefined,
      })),
      sections: buildSectionsStructure({ sections, baseElements }),
    })
    setIsLoading(false)
  }, [data, loading])

  return {
    error: structureError || error?.message,
    isLoading: loading || isLoading,
    isMessageEvaluated,
    submissionMessage: evaluatedMessage,
    structure,
    template,
  }
}

export default useLoadApplication
