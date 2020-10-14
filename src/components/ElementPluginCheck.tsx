import React, { useState } from 'react'
import { Form, Message } from 'semantic-ui-react'
import { TemplateViewWrapper, ApplicationViewWrapper, pluginProvider } from '../elementPlugins'
import { TemplateElement } from '../generated/graphql'

// Needs to be called when app loads (REST call to back end)
// TODO
pluginProvider.pluginManifest = {
  basicText: {
    displayName: 'Basic Text Input',
    isCore: true,
    folderName: 'basicText',
    category: 'Input',
  },
  textInfo: {
    isCore: true,
    displayName: 'Static Text',
    folderName: 'textInfo',
    category: 'Informative',
  },
}

// This is just to make typescrip happy
const extra = {
  nodeId: '2',
  id: 2,
  applicationResponses: {
    nodes: [],
    edges: [],
    pageInfo: { hasNextPage: false, hasPreviousPage: false },
    totalCount: 1,
  },
}

const initialTemplatesState = [
  {
    code: 'firstInformative',
    elementTypePluginCode: 'textInfo',
    parameters: {
      title: 'Things to do ?',
      text: 'Enter first name and last name, only letters and spaces are allowed',
    },
    isEditable: '{"value": true}',
    isRequired: '{"value": false}',
    visibilityCondition: '{"value": true}',
    // Keep TS happy
    ...extra,
  },
  {
    code: 'firstQuestion',
    elementTypePluginCode: 'basicText',
    parameters: {
      placeholder: 'Enter First Name',
    },
    isEditable: '{"value": true}',
    isRequired: '{"value": false}',
    visibilityCondition: '{"value": true}',
    title: 'First Name',
    // Keep TS happy
    ...extra,
  },
  {
    code: 'secondQuestion',
    elementTypePluginCode: 'basicText',
    parameters: {
      placeholder: 'Enter Last Name',
    },
    isEditable: '{"value": true}',
    isRequired: '{"value": false}',
    visibilityCondition: '{"value": true}',
    title: 'Last Name',
    // Keep TS happy
    ...extra,
  },
]

const initialApplicationState = [
  {
    code: 'firstInformative',
    value: '',
  },
  {
    code: 'firstQuestion',
    value: '',
  },
  {
    code: 'secondQuestion',
    value: '',
  },
]

const ElementPluginCheck = () => {
  //   const initialValue = 'yow'
  const [templateState, setTemplateState] = useState(initialTemplatesState)
  const [applicationState, setApplicationState] = useState(initialApplicationState)

  const getTemplate = (code: string) =>
    templateState.find((template) => template.code === code) || templateState[0]

  return (
    <>
      <h1>Application View</h1>

      <Form>
        {applicationState.map(({ code, value }, index) => (
          <ApplicationViewWrapper
            key={index}
            templateElement={getTemplate(code)}
            initialValue={value}
            isEditable={evaluateCondition(getTemplate(code).isEditable)}
            isVisibleExpression={JSON.parse(getTemplate(code).visibilityCondition)}
            onUpdate={(newState: any) =>
              setApplicationState(updateArrayElement(applicationState, newState, index))
            }
          />
        ))}
      </Form>
      <h1>Application State</h1>
      <Message>
        <pre>{JSON.stringify(applicationState, null, '  ')}</pre>
      </Message>

      <h1>TemplateView</h1>

      {templateState.map((templateElement, index) => (
        <TemplateViewWrapper
          templateElement={templateElement}
          onUpdate={(templateElementUpdated: any) =>
            setTemplateState(updateArrayElement(templateState, templateElementUpdated, index))
          }
        />
      ))}

      <h1>Template State</h1>
      <Message>
        <pre>{JSON.stringify(templateState, null, '  ')}</pre>
      </Message>
    </>
  )
}

function evaluateCondition(condition: string) {
  return JSON.parse(condition).value === true
}

function updateArrayElement(templateState: any, newTemplateElement: any, index: number) {
  return [
    ...templateState.slice(0, index),
    { ...templateState[index], ...newTemplateElement },
    ...templateState.slice(index + 1),
  ]
}

export default ElementPluginCheck
