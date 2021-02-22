import { useEffect, useState } from 'react'
import {
  ApplicationDetails,
  ApplicationStages,
  ElementBase,
  FullStructure,
  TemplateDetails,
  TemplateElementState,
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

const MAX_REFETCH = 10

const useLoadApplication = ({ serialNumber, networkFetch }: UseGetApplicationProps) => {
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    if (!data || loading) return
    const application = data.applicationBySerial as Application

    if (!application) {
      setIsLoading(false)
      return
    }

    if (!application.template) {
      setStructureError('No template found')
      return
    }

    // Checking if trigger is running before loading current status
    if (application.trigger !== null && refetchAttempts < MAX_REFETCH) {
      setTimeout(() => {
        console.log('Will refetch loadApplication', refetchAttempts) // TODO: Remove log
        setRefetchAttempts(refetchAttempts + 1)
        refetch()
      }, 500)
      return
    } else setRefetchAttempts(0)

    const { id, code, name, startMessage } = application.template as Template

    setTemplate({
      id,
      code,
      name: name as string,
      startMessage: startMessage ? startMessage : undefined,
    })

    const applicationSection = application.applicationSections.nodes as ApplicationSection[]
    const sections = getApplicationSections(applicationSection)

    const templateStages = application.template?.templateStages.nodes as TemplateStage[]

    const stagesDetails: ApplicationStages = {
      stages: templateStages.map((stage) => ({
        number: stage.number as number,
        title: stage.title as string,
        description: stage.description ? stage.description : undefined,
      })),
      submissionMessage: application.template?.submissionMessage as string,
    }

    const stages = data.applicationStageStatusAlls?.nodes as ApplicationStageStatusAll[]
    if (stages.length > 1) console.log('StageStatusAll More than one results for 1 application!')
    const { stageId, stage, status, statusHistoryTimeCreated } = stages[0] // Should only have one result

    const applicationDetails: ApplicationDetails = {
      id: application.id,
      type: application.template?.name as string,
      isLinear: application.template?.isLinear as boolean,
      serial: application.serial as string,
      name: application.name as string,
      outcome: application.outcome as string,
      stage: {
        id: stageId as number,
        name: stage as string,
        status: status as string,
        date: statusHistoryTimeCreated.split('T')[0],
      },
      status: status as ApplicationStatus,
    }

    const baseElements: ElementBase[] = []
    application.applicationSections.nodes.forEach((sectionNode) => {
      let pageCount = 1
      const elementsInSection = sectionNode?.templateSection?.templateElementsBySectionId
        ?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        if (element.elementTypePluginCode === 'pageBreak') pageCount++
        else
          baseElements.push({
            ...element,
            pluginCode: element.elementTypePluginCode,
            sectionIndex: sectionNode?.templateSection?.index,
            sectionCode: sectionNode?.templateSection?.code,
            elementIndex: element.index,
            page: pageCount,
          } as TemplateElementState)
      })
    })

    setFullStructure({
      info: applicationDetails,
      stages: stagesDetails,
      sections: buildSectionsStructure({ sections, baseElements }),
    })
    setIsLoading(false)
  }, [data, loading])

  return {
    error: structureError || error?.message,
    isLoading: loading || isLoading,
    structure,
    template,
  }
}

export default useLoadApplication
