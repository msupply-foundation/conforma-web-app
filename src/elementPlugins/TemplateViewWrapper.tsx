import React, { useState } from 'react'
import { Input, Dropdown, Segment } from 'semantic-ui-react'
import { pluginProvider, ErrorBoundary, JsonInput } from './'
import { OnUpdateTemplateWrapperView, PluginComponents, TemplateViewWrapperProps } from './types'

const TemplateViewWrapper = (props: TemplateViewWrapperProps) => {
  const { templateElement, onUpdate } = props

  const {
    elementTypePluginCode: initialPluginCode,
    parameters: initialParameters,
    title: initialTitle,
    code,
    visibilityCondition,
  } = templateElement

  if (!initialPluginCode) return null

  const [pluginCode, setPluginCode] = useState(initialPluginCode)
  const [pluginInfo, setPluginInfo] = useState(pluginProvider.pluginManifest[initialPluginCode])
  const [title, setTitle] = useState(initialTitle)

  const { TemplateView }: PluginComponents = pluginProvider.getPluginElement(pluginCode)

  return (
    <Segment>
      <Dropdown
        options={getPluginOptions()}
        selection
        onChange={onPluginSelection(setPluginCode, setPluginInfo, onUpdate)}
        value={pluginCode}
      />
      <Input fluid label="Code" value={/*not editable in this PR*/ code} />
      <JsonInput
        label={'Is Visible Condition'}
        initialValue={visibilityCondition}
        onUpdate={onJsonFieldChange('visibilityCondition', onUpdate)}
      />

      {pluginInfo.category === 'Informative' ? null : renderJsonFields(templateElement, onUpdate)}

      {pluginInfo.category === 'Informative' ? null : (
        <Input
          fluid
          label="Label"
          value={title}
          onChange={onFieldChange('title', onUpdate, setTitle)}
        />
      )}

      <ErrorBoundary pluginCode={pluginCode}>
        <React.Suspense fallback="Loading Plugin">
          {
            <TemplateView
              parameters={initialParameters}
              onUpdate={(newParameters: any) =>
                onUpdate({ parameters: { ...initialParameters, ...newParameters } })
              }
            />
          }
        </React.Suspense>
      </ErrorBoundary>
    </Segment>
  )
}
const jsonFields = {
  isRequired: 'Is Required Condition',
  isEditable: 'Is Editable Condition',
}
// any for templateElement due to Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'TemplateElement'
// TODO fix
function renderJsonFields(templateElement: any, onUpdate: OnUpdateTemplateWrapperView) {
  return (
    <>
      {Object.entries(jsonFields).map(([key, title]) => (
        <JsonInput
          key={key}
          label={title}
          initialValue={templateElement[key]}
          onUpdate={onJsonFieldChange(key, onUpdate)}
        />
      ))}
    </>
  )
}

function getPluginOptions() {
  return Object.entries(pluginProvider.pluginManifest).map(([pluginCode, pluginInfo]) => {
    return {
      key: pluginCode,
      value: pluginCode,
      text: pluginInfo.displayName,
    }
  })
}

function onJsonFieldChange(key: string, onUpdate: any) {
  return (value: string) => {
    onUpdate({ [key]: value })
  }
}

function onFieldChange(key: string, onUpdate: any, onSetValue: any) {
  return (_: any, { value }: any) => {
    onSetValue(value)
    onUpdate({ [key]: value })
  }
}

function onPluginSelection(setPluginCode: any, setPluginInfo: any, onUpdate: any) {
  return (_: any, { value: pluginCode }: any) => {
    setPluginCode(pluginCode)
    setPluginInfo(pluginProvider.pluginManifest[pluginCode])
    onUpdate({ elementTypePluginCode: pluginCode })
  }
}

export default TemplateViewWrapper
