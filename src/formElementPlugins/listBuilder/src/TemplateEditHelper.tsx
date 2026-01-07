import { Button } from 'semantic-ui-react'
import { ElementState } from '../../../utils/types'
import { useOperationState } from '../../../containers/TemplateBuilder/shared/OperationContext'
import { useFormStructureState } from '../../../containers/TemplateBuilder/template/Form/FormWrapper'
import { useTemplateState } from '../../../containers/TemplateBuilder/template/TemplateWrapper'
import { TemplateElementCategory } from '../../../utils/generated/graphql'
import { useFullApplicationState } from '../../../containers/TemplateBuilder/template/ApplicationWrapper'

const TemplateEditHelper = ({ element }: { element: ElementState }) => {
  const { moveStructure } = useFormStructureState()
  const { allElements } = useTemplateState()
  const { reloadApplication } = useFullApplicationState()
  const {
    showElementSelect,
    setShowElementSelect,
    updateTemplateSection,
    selectedElementIds,
    clearSelectedElements,
  } = useOperationState()
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
        // These are required, but get auto-updated by Postgres function
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
    }).then(reloadApplication)
  }

  const handleAbsorb = () => {
    setShowElementSelect(!showElementSelect)

    const selectedElements = allElements.filter((el) => selectedElementIds.includes(el.id))

    const inputFields = selectedElements.map(
      ({
        // required
        category,
        code,
        title = '',
        elementTypePluginCode,
        isEditable,
        parameters,
        // optional
        isRequired,
        visibilityCondition,
        validation,
        validationMessage = null,
      }) => {
        const field: Record<string, unknown> = {
          category: category ?? TemplateElementCategory.Question,
          code,
          title: title || '',
          elementTypePluginCode,
          parameters,
        }
        if (isEditable !== true) field.isEditable = isEditable
        if (isRequired !== true) field.isRequired = isRequired
        if (visibilityCondition !== true) field.isVisible = visibilityCondition
        if (validation !== true) field.validationExpression = validation
        if (validationMessage !== null) field.validationMessage = validationMessage
        return field
      }
    )

    const currentSection = Object.values(moveStructure.sections).find(
      (section) => section.index === element.sectionIndex
    )
    if (!currentSection) {
      console.error('Current section not found')
      return
    }

    updateTemplateSection(currentSection.id, {
      templateElementsUsingId: {
        updateById: [
          {
            id: element.id,
            patch: { parameters: { ...element.parameters, inputFields } },
          },
        ],
        deleteById: selectedElementIds.map((id) => ({ id })),
      },
    }).then(reloadApplication)
  }

  const handleCancel = () => {
    clearSelectedElements()
    setShowElementSelect(false)
  }

  if (inputFields.length === 0)
    return (
      <div className="flex-row-end">
        {showElementSelect && (
          <Button secondary inverted size="tiny" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        {(selectedElementIds.length > 0 || !showElementSelect) && (
          <Button
            secondary
            inverted={!showElementSelect}
            size="tiny"
            onClick={handleAbsorb}
            style={{ minWidth: 100 }}
          >
            {showElementSelect ? 'Go!' : 'Absorb elements'}
          </Button>
        )}
      </div>
    )

  return (
    <div className="flex-row-end">
      <Button secondary inverted size="tiny" onClick={handleExtract}>
        Extract elements
      </Button>
    </div>
  )
}

export default TemplateEditHelper
