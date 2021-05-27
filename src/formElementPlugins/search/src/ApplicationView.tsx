import React, { useEffect, useState } from 'react'
import { Search, Label, Card, Icon } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import strings from '../constants'
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
    multiSelect = false,
    minCharacters = 1,
    resultFormat,
    displayFormat = resultFormat,
  } = parameters
  const { source } = parameterExpressions

  const graphQLEndpoint = applicationData.config.serverGraphQL

  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [selection, setSelection] = useState<any[]>(currentResponse?.selection || [])
  const { isEditable } = element

  useEffect(() => {
    onSave({
      text: selection.length > 0 ? createTextString(selection) : undefined,
      selection: selection,
    })
  }, [selection])

  const handleChange = (e: any) => {
    const text = e.target.value
    setSearchText(text)
    if (text.length < minCharacters) return
    const search = { text: e.target.value }
    setLoading(true)
    evaluateExpression(source, {
      objects: { search },
      APIfetch: fetch,
      graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
    })
      .then((results: any) => {
        if (results == null) {
          setResults([])
        } else if (!Array.isArray(results)) setResults([results])
        else setResults(results)
        setLoading(false)
      })
      .catch((err) => {
        console.log('Search error:', err.message)
      })
  }

  const handleSelect = (e: any, data: any) => {
    const selectedResult = results[data.result.index]
    if (!multiSelect) setSelection([selectedResult])
    else setSelection([...selection, selectedResult])
    setSearchText('')
  }

  const deleteItem = async (index: number) => {
    // setListItems(listItems.filter((_, i) => i !== index))
    // resetModalState()
  }

  const displayProps: DisplayProps = {
    selection,
    displayFormat,
    deleteItem: isEditable ? deleteItem : () => {},
    Markdown,
    isEditable,
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Search
        value={searchText}
        loading={loading}
        onSearchChange={handleChange}
        onResultSelect={handleSelect}
        minCharacters={minCharacters}
        placeholder={placeholder}
        results={loading ? [{ title: 'Loading...' }] : createResultsObject(results, resultFormat)}
        disabled={!isEditable}
        // className="flex-grow-1"
        input={{ icon: icon, iconPosition: 'left' }}
        noResultsMessage={strings.MESSAGE_NO_RESULTS}
      />
      <DisplaySelection {...displayProps} />
    </>
  )
}

export default ApplicationView

const createResultsObject = (results: any, resultsFormat: any) => {
  return results.map((r: any, index: number) => ({
    index,
    key: `result-${index}`,
    title: substituteValues(resultsFormat.title, r),
    description: substituteValues(resultsFormat.description, r),
  }))
}

const substituteValues = (parameterisedString: string, object: any) => {
  const getValueFromObject = (_: string, $: string, property: string) => object?.[property] || ''
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getValueFromObject)
}

const createTextString = (input: any) => JSON.stringify(input)

export interface DisplayProps {
  selection: any[]
  displayFormat: { title?: string; subtitle?: string; description: string }
  Markdown: any
  deleteItem?: (index: number) => void
  isEditable?: boolean
}

export const DisplaySelection: React.FC<DisplayProps> = ({
  selection,
  displayFormat,
  deleteItem = () => {},
  Markdown,
  isEditable = true,
}) => {
  const { title, subtitle, description } = displayFormat
  return (
    <>
      {selection.map((item, index) => (
        <Card key={`list-item-${index}`}>
          <Card.Content>
            {isEditable && (
              <Label floating onClick={() => deleteItem(index)}>
                <Icon name="delete" />
              </Label>
            )}
            {title && (
              <Card.Header>
                <Markdown text={substituteValues(title, item)} semanticComponent="noParagraph" />
              </Card.Header>
            )}
            {subtitle && (
              <Card.Meta>
                <Markdown text={substituteValues(subtitle, item)} semanticComponent="noParagraph" />
              </Card.Meta>
            )}
            {description && (
              <Card.Description>
                <Markdown
                  text={substituteValues(description, item)}
                  semanticComponent="noParagraph"
                />
              </Card.Description>
            )}
          </Card.Content>
        </Card>
      ))}
    </>
  )
}
