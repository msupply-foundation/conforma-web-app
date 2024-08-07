import { EvaluatorNode } from '../../../../modules/expression-evaluator'
import React, { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import {
  TemplateElementCategory,
  useGetTemplateElementsByPluginQuery,
} from '../../../../utils/generated/graphql'
import { ParametersType } from '../../shared/Parameters'

type ExistingElement = {
  category: TemplateElementCategory
  helpText: string
  parameters: ParametersType
  initialValue: EvaluatorNode
  visibilityCondition: EvaluatorNode
  validationMessage: string
  isRequired: EvaluatorNode
  isEditable: EvaluatorNode
  validation: EvaluatorNode
}

type FromExistingElementState = {
  isSearching: boolean
  pluginCode: string
  options: {
    text: string
    key: number
    value?: number
    valueFull?: ExistingElement
  }[]
}

type FromExistingElementProps = {
  pluginCode: string
  setTemplateElement: (existingElement: ExistingElement) => void
}

const FromExistingElement: React.FC<FromExistingElementProps> = ({
  pluginCode,
  setTemplateElement,
}) => {
  const [elementTemplateState, setElementTemplateState] = useState<FromExistingElementState>({
    isSearching: false,
    pluginCode: '',
    options: [],
  })
  const { data: elementSearchData } = useGetTemplateElementsByPluginQuery({
    skip: !elementTemplateState.isSearching,
    variables: { pluginCode: elementTemplateState.pluginCode },
  })

  useEffect(() => {
    const newState = { isSearching: false }
    if (
      elementTemplateState.isSearching &&
      (!elementSearchData?.templateElements?.nodes ||
        elementSearchData.templateElements?.nodes.length === 0)
    )
      return setElementTemplateState({
        ...elementTemplateState,
        ...newState,
        options: [{ text: 'No existing matching template elements found', key: -2 }],
      })

    if (!elementSearchData?.templateElements?.nodes) return

    const newOptions = elementSearchData.templateElements?.nodes.map((templateElement) => ({
      text: `${templateElement?.templateCode} - ${templateElement?.code} - ${templateElement?.title}`,
      key: templateElement?.id || 0,
      value: templateElement?.id || 0,
      valueFull: {
        category: templateElement?.category as TemplateElementCategory,
        helpText: templateElement?.helpText || '',
        parameters: templateElement?.parameters || {},
        initialValue: templateElement?.initialValue || '',
        visibilityCondition: templateElement?.visibilityCondition,
        validationMessage: templateElement?.validationMessage || '',
        isRequired: templateElement?.isRequired,
        isEditable: templateElement?.isEditable,
        validation: templateElement?.validation,
      },
    }))

    setElementTemplateState({
      ...elementTemplateState,
      ...newState,
      options: newOptions,
    })
  }, [elementSearchData])

  return (
    <Dropdown
      text="Or select from existing..."
      className="from-existing-dropdown"
      search
      selection
      icon="search"
      onClick={() => {
        setElementTemplateState({
          isSearching: true,
          pluginCode: pluginCode,
          options: [{ text: 'Loading', key: -1 }],
        })
      }}
      options={elementTemplateState.options}
      onChange={(_, { value }) => {
        const selected = elementTemplateState.options.find((option) => option?.value === value)
        if (selected?.valueFull) setTemplateElement(selected.valueFull)
      }}
    />
  )
}

export default FromExistingElement
