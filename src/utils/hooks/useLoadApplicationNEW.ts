import { useEffect, useState } from 'react'
import {
  ApplicationDetails,
  ApplicationStages,
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
  Template,
  TemplateElement,
  TemplateStage,
  useGetApplicationNewQuery,
} from '../generated/graphql'

const useLoadApplication = ({ serialNumber, networkFetch }: UseGetApplicationProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [structureError, setStructureError] = useState('')
  const [structure, setFullStructure] = useState<FullStructure>()
  const [template, setTemplate] = useState<TemplateDetails>()

  const { data, error } = useGetApplicationNewQuery({
    variables: {
      serial: serialNumber,
    },
    fetchPolicy: networkFetch ? 'network-only' : 'cache-first',
  })

  useEffect(() => {
    if (!data) return
    const application = data.applicationBySerial as Application

    if (!application) {
      setIsLoading(false)
      return
    }

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

    const applicationDetails: ApplicationDetails = {
      id: application.id,
      type: application.template?.name as string,
      isLinear: application.template?.isLinear as boolean,
      serial: application.serial as string,
      name: application.name as string,
      outcome: application.outcome as string,
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

    setFullStructure({
      info: applicationDetails,
      stages: stagesDetails,
      sections: buildSectionsStructure({ sections, baseElements }),
    })
    setIsLoading(false)
  }, [data])

  return {
    error: structureError || error?.message,
    isLoading,
    structure,
    template,
  }
}

export default useLoadApplication
