import { Button } from 'semantic-ui-react'
import { ApplicationDetails, ElementState } from '../../../utils/types'
import { useOperationState } from '../../../containers/TemplateBuilder/shared/OperationContext'
import { useFormStructureState } from '../../../containers/TemplateBuilder/template/Form/FormWrapper'

interface ListBuilderEditHelperProps {
  element: ElementState
  onUpdate: (value: string) => void
  onSave: (value: any) => void
  applicationData: ApplicationDetails
}

const TemplateEditHelper = ({
  element,
  //   onUpdate,
  //   onSave,
  applicationData,
  ...props
}: //   ...props
ListBuilderEditHelperProps) => {
  const { moveStructure } = useFormStructureState()
  const { showElementCheckboxes, setShowElementCheckboxes, updateTemplateSection } =
    useOperationState()
  const inputFields = element.parameters?.inputFields ?? []

  const handleExtract = () => {
    const currentSection = Object.values(moveStructure.sections).find(
      (section) => section.index === element.sectionIndex
    )

    if (!currentSection) {
      console.error('Current section not found')
      return
    }
    const currentPage = Object.values(currentSection.pages).find(
      (page) => page.pageNumber === element.page
    )
    if (!currentPage) {
      console.error('Current page not found')
      return
    }

    const elementsAfterThisElement = currentSection.allElements.filter(
      ({ index }) => index > (element?.elementIndex ?? 0)
    )

    const innerElements = inputFields.map((inputField: any, idx: number) => {
      const {
        isVisible: visibilityCondition,
        validationExpression: validation,
        ...rest
      } = inputField
      return {
        visibilityCondition,
        validation,
        ...rest,
        index: (element?.elementIndex ?? 0) + 1 + idx,
        templateCode: '__Temp',
        templateVersion: '__Temp',
      }
    })

    const existingElementPatch: {
      id: number
      patch: { index?: number; parameters?: Record<string, unknown> }
    }[] = elementsAfterThisElement.map(({ id, index }) => ({
      id,
      patch: { index: index + innerElements.length },
    }))

    existingElementPatch.push({
      id: element.id,
      patch: { parameters: { ...element.parameters, inputFields: [] } },
    })

    updateTemplateSection(currentSection.id, {
      templateElementsUsingId: {
        updateById: existingElementPatch,
        create: innerElements,
      },
    })
  }

  const handleAbsorb = () => {
    setShowElementCheckboxes(!showElementCheckboxes)
  }

  return inputFields.length === 0 ? (
    <Button onClick={handleAbsorb}>Absorb elements</Button>
  ) : (
    <Button onClick={handleExtract}>Extract elements</Button>
  )
}

export default TemplateEditHelper
