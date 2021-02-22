import { useEffect, useState } from 'react'
import {
  ApplicationDetails,
  ApplicationElementStates,
  ApplicationStages,
  ElementState,
  FullStructure,
  TemplateDetails,
  TemplateElementState,
  UseGetApplicationProps,
  User,
} from '../types'
import evaluateExpression from '@openmsupply/expression-evaluator'
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

const useLoadApplication = ({
  currentUser,
  serialNumber,
  networkFetch,
}: UseGetApplicationProps) => {
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

    const templateElements = [] as TemplateElementState[]
    application.applicationSections.nodes.forEach((sectionNode) => {
      let pageCount = 1
      const elementsInSection = sectionNode?.templateSection?.templateElementsBySectionId
        ?.nodes as TemplateElement[]
      elementsInSection.forEach((element) => {
        if (element.elementTypePluginCode === 'pageBreak') pageCount++
        else
          templateElements.push({
            ...element,
            pluginCode: element.elementTypePluginCode,
            sectionIndex: sectionNode?.templateSection?.index,
            sectionCode: sectionNode?.templateSection?.code,
            elementIndex: element.index,
            page: pageCount,
          } as TemplateElementState)
      })
    })

    evaluateElementExpressions({ currentUser: currentUser as User, templateElements }).then(
      (result) => {
        setFullStructure({
          info: applicationDetails,
          stages: stagesDetails,
          sections: buildSectionsStructure({ sections, elementsState: result }),
        })
        setIsLoading(false)
      }
    )
  }, [data])

  return {
    error: structureError || error?.message,
    isLoading,
    structure,
    template,
  }
}

interface EvaluateElementExpressionsProps {
  currentUser: User
  templateElements: TemplateElementState[]
}

async function evaluateElementExpressions({
  currentUser,
  templateElements,
}: EvaluateElementExpressionsProps) {
  const promiseArray: Promise<ElementState>[] = []
  templateElements.forEach((element) => {
    promiseArray.push(evaluateSingleElement({ currentUser, element }))
  })
  const evaluatedElements = await Promise.all(promiseArray)
  const elementsState: ApplicationElementStates = {}
  evaluatedElements.forEach((element) => {
    elementsState[element.code] = element
  })
  return elementsState
}

interface EvaluateSingleElementProps {
  currentUser: User
  element: TemplateElementState
}

async function evaluateSingleElement({
  currentUser,
  element,
}: EvaluateSingleElementProps): Promise<ElementState> {
  const evaluationParameters = {
    objects: { currentUser },
    // TO-DO: Also send org objects etc.
    // graphQLConnection: TO-DO
  }
  const isEditable = evaluateExpression(element.isEditable, evaluationParameters)
  const isRequired = evaluateExpression(element.isRequired, evaluationParameters)
  const isVisible = evaluateExpression(element.visibilityCondition, evaluationParameters)
  // TO-DO: Evaluate element parameters (in 'parameters' field, but unique to each element type)
  const results = await Promise.all([isEditable, isRequired, isVisible])
  const evaluatedElement = {
    id: element.id,
    code: element.code,
    title: element.title,
    category: element.category,
    parameters: element.parameters,
    pluginCode: element.pluginCode,
    sectionIndex: element.sectionIndex,
    sectionCode: element.sectionCode,
    elementIndex: element.elementIndex,
    validation: element.validation,
    validationMessage: element.validationMessage,
    page: element.page, // TODO: Should be removed - this is not storing the page
    isEditable: results[0] as boolean,
    isRequired: results[1] as boolean,
    isVisible: results[2] as boolean,
  }

  return evaluatedElement
}

export default useLoadApplication
