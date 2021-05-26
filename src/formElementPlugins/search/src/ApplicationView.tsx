import React, { useEffect, useState } from 'react'
import { Search, Label } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import evaluateExpression from '@openmsupply/expression-evaluator'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  parameterExpressions,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  applicationData,
}) => {
  const {
    label,
    description,
    placeholder = 'Search...',
    icon = 'search',
    multiSelect,
    minCharacters = 1,
    resultFormat,
    displayFormat,
  } = parameters
  const { source } = parameterExpressions

  const graphQLEndpoint = applicationData.config.serverGraphQL

  // const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const { isEditable } = element

  function handleChange(e: any) {
    const text = e.target.value
    if (text.length < minCharacters) return
    const search = { text: e.target.value }
    evaluateExpression(source, {
      objects: { search },
      APIfetch: fetch,
      graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
    }).then((results: any) => {
      console.log(results)
      setResults(results)
    })
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Search
        onSearchChange={handleChange}
        minCharacters={minCharacters}
        placeholder={placeholder}
        results={createResultsObject(results, resultFormat)}
        disabled={!isEditable}
        className="flex-grow-1"
        // size="large"
        input={{ icon: icon, iconPosition: 'left' }}
      />

      {validationState.isValid ? null : (
        <Label basic color="red" pointing>
          {validationState?.validationMessage}
        </Label>
      )}
    </>
  )
}

export default ApplicationView

const createResultsObject = (results: any, resultsFormat: any) =>
  results.map((r: any) => ({
    key: Math.random(),
    title: substituteValues(resultsFormat.title, r),
    description: substituteValues(resultsFormat.description, r),
  }))

const substituteValues = (parameterisedString: string, object: any) => {
  const getValueFromObject = (_: string, $: string, property: string) => object[property] || ''
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getValueFromObject)
}
