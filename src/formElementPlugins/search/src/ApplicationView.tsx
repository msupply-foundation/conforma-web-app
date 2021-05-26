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
  const { label, description, placeholder, icon = 'search' } = parameters
  const { source } = parameterExpressions

  const graphQLEndpoint = applicationData.config.serverGraphQL

  // const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<any[]>()
  const [selectedIndex, setSelectedIndex] = useState<number>()
  const { isEditable } = element

  function handleChange(e: any, data: any) {
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

  // function handleChange(e: any, data: any) {
  //   const { value: optionIndex } = data
  //   setSelectedIndex(optionIndex === '' ? undefined : optionIndex)
  //   if (optionIndex !== '')
  //     onSave({
  //       text: optionsDisplayProperty
  //         ? options[optionIndex][optionsDisplayProperty]
  //         : options[optionIndex],
  //       selection: options[optionIndex],
  //       optionIndex,
  //     })
  //   // Reset response if selection cleared
  //   else onSave(null)
  // }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Search
        onSearchChange={handleChange}
        // results={results?.map((e) => e.username)}
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
