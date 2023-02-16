const DEBOUNCE_TIMEOUT = 350 //milliseconds

import React, { useEffect, useState } from 'react'
import { Search, Label, Card, Icon, Form, List, ListItem } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { useUserState } from '../../../contexts/UserState'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { substituteValues } from '../../../utils/helpers/utilityFunctions'
import evaluateExpression from '@openmsupply/expression-evaluator'
import config from '../../../config'
import useDebounce from './useDebounce'
import './styles.css'
import useDefault from '../../useDefault'

interface DisplayFormat {
  title?: string
  subtitle?: string
  description?: string
  simple?: boolean
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  currentResponse,
  validationState,
  onSave,
  Markdown,
  applicationData,
  allResponses,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('search')
  const {
    label,
    description,
    placeholder = strings.DEFAULT_PLACEHOLDER,
    source,
    icon = 'search',
    multiSelect = false,
    minCharacters = 1,
    displayFormat = {},
    resultFormat = displayFormat,
    textFormat,
    displayType = 'card',
    default: defaultValue,
    persistUserInput,
  } = parameters

  const {
    userState: { currentUser },
  } = useUserState()

  const graphQLEndpoint = applicationData.config.getServerUrl('graphQL')

  const [searchText, setSearchText] = useState(
    displayType === 'input' && !!currentResponse?.selection
      ? substituteValues(
          displayFormat.title ?? displayFormat.description,
          currentResponse.selection[0]
        )
      : ''
  )
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [selection, setSelection] = useState<any[]>(currentResponse?.selection ?? [])
  const { isEditable } = element

  const [debounceOutput, setDebounceInput] = useDebounce<string>('', DEBOUNCE_TIMEOUT)

  useDefault({
    defaultValue,
    currentResponse,
    persistUserInput,
    onChange: (defaultSelection) => {
      setSelection(Array.isArray(defaultSelection) ? defaultSelection : [defaultSelection])
      setSearchText(
        displayType === 'input'
          ? substituteValues(displayFormat.title ?? displayFormat.description, defaultSelection)
          : ''
      )
    },
  })

  useEffect(() => {
    onSave({
      text: getTextFormat(textFormat, selection),
      selection,
    })
  }, [selection])

  useEffect(() => {
    if (!debounceOutput) return
    evaluateSearchQuery(debounceOutput)
  }, [debounceOutput])

  const evaluateSearchQuery = (text: string) => {
    const search = { text }
    const JWT = localStorage.getItem(config.localStorageJWTKey)
    evaluateExpression(source, {
      objects: { search, currentUser, applicationData, responses: allResponses },
      APIfetch: fetch,
      graphQLConnection: { fetch: fetch.bind(window), endpoint: graphQLEndpoint },
      headers: { Authorization: 'Bearer ' + JWT },
    })
      .then((results: any) => {
        if (results == null) {
          setResults([])
        } else if (!Array.isArray(results)) setResults([results])
        else setResults(results)
        setDebounceInput('')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Search error:', err.message)
        setDebounceInput('')
        setLoading(false)
      })
  }

  const handleChange = (e: any) => {
    const text = e.target.value
    setSearchText(text)
    if (text.length < minCharacters) return
    setDebounceInput(text)
    setLoading(true)
  }

  const handleSelect = (_: any, data: any) => {
    const selectedResult = results[data.result.index]
    if (!selectedResult) return // Don't select "Loading" item
    if (!multiSelect) setSelection([selectedResult])
    else setSelection([...selection, selectedResult])
    setSearchText(
      displayType === 'input'
        ? substituteValues(displayFormat.title ?? displayFormat.description, selectedResult)
        : ''
    )
  }

  const deleteItem = async (index: number) => {
    setSelection(selection.filter((_, i) => i !== index))
  }

  const createResultsArray = (results: any[], resultsFormat: DisplayFormat) => {
    const { title, description } = resultsFormat
    const noFormatProvided = !title && !description
    return results.map((result: any, index: number) => {
      const titleString = noFormatProvided
        ? getDefaultString(result, strings.MESSAGE_NO_RESULTS)
        : title
        ? substituteValues(title, result)
        : ''
      const descriptionString = noFormatProvided
        ? getDefaultString(result, strings.MESSAGE_NO_RESULTS, 'description')
        : description
        ? substituteValues(description, result)
        : ''
      return {
        index,
        key: `result-${index}`,
        title: titleString,
        description: descriptionString,
      }
    })
  }

  const displayProps: DisplayProps = {
    selection,
    displayFormat,
    displayType,
    deleteItem: isEditable ? deleteItem : () => {},
    Markdown,
    isEditable,
  }

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <Form.Field key={`search-${label}`} error={!validationState.isValid}>
        <Search
          value={searchText}
          loading={loading}
          onSearchChange={handleChange}
          onResultSelect={handleSelect}
          minCharacters={minCharacters}
          placeholder={placeholder}
          results={
            loading
              ? [{ title: strings.MESSAGE_LOADING }]
              : createResultsArray(results, resultFormat)
          }
          disabled={!isEditable}
          input={{ icon, iconPosition: 'left' }}
          noResultsMessage={strings.MESSAGE_NO_RESULTS}
        />
        {validationState.isValid ? null : (
          <Label pointing prompt content={validationState?.validationMessage} />
        )}
      </Form.Field>
      {displayType !== 'input' && <DisplaySelection {...displayProps} />}
    </>
  )
}

const getTextFormat = (textFormat: string, selection: any[]): string | undefined => {
  if (selection.length === 0) return undefined
  if (textFormat) {
    const strings = selection.map((item) => substituteValues(textFormat, item))
    return strings.join(', ')
  }
  // Default "text" field -- needs to return consistent string regardless of
  // object field order
  const strings = selection.map((item) => {
    const itemFields = Object.entries(item)
      .sort()
      .map(([key, value]) => `${key}: ${value}`)
    return `{${itemFields.join(', ')}}`
  })
  return strings.join(', ')
}
export interface DisplayProps {
  selection: any[]
  displayFormat: DisplayFormat
  displayType: 'card' | 'list' | 'input'
  Markdown: any
  deleteItem?: (index: number) => void
  isEditable?: boolean
}

export const DisplaySelection: React.FC<DisplayProps> = ({
  selection,
  displayFormat,
  displayType,
  deleteItem = () => {},
  Markdown,
  isEditable = true,
}) => {
  const { getPluginStrings } = useLanguageProvider()
  const strings = getPluginStrings('search')
  const { title, subtitle, description } = displayFormat
  const showFallbackString = !title && !subtitle && !description
  return displayType === 'list' || displayType === 'input' ? (
    <List bulleted={selection.length > 1}>
      {selection.map((item, index) => (
        <ListItem key={index} className="search-list-item">
          <div className="flex-row-start">
            {title ? (
              <Markdown text={substituteValues(title, item)} semanticComponent="noParagraph" />
            ) : description ? (
              <Markdown
                text={substituteValues(description, item)}
                semanticComponent="noParagraph"
              />
            ) : (
              getDefaultString(item, strings.MESSAGE_NO_RESULTS, 'description')
            )}{' '}
            {isEditable && (
              <Icon
                className="search-list-item-icon"
                link
                name="close"
                circular
                fitted
                size="small"
                color="blue"
                onClick={() => deleteItem(index)}
                style={{ position: 'relative', top: -2, left: 5 }}
              />
            )}
          </div>
        </ListItem>
      ))}
    </List>
  ) : (
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
            <Card.Description>
              <Markdown
                text={
                  description
                    ? substituteValues(description, item)
                    : getFallbackString(item, showFallbackString)
                }
                semanticComponent="noParagraph"
              />
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </>
  )
}

const getFallbackString = (item: any, showFallbackString: boolean) =>
  showFallbackString
    ? Object.keys(item).reduce((str, field) => str + `${field}: ${item[field]}  \n`, '')
    : ''

type ResultsField = 'title' | 'description'
// If a displayFormat is not defined, results will display some combination of
// the first two fields in the object
const getDefaultString = (
  result: any,
  noResultString: string,
  fieldType: ResultsField = 'title'
) => {
  if (!(result instanceof Object)) return result
  const fields = Object.keys(result)
  switch (fields.length) {
    case 0:
      return fieldType === 'title' ? noResultString : ''
    case 1:
      return fieldType === 'title' ? fields[0] : result[fields[0]]
    default:
      return fieldType === 'title'
        ? `${fields[0]}: ${result[fields[0]]}`
        : `${fields[1]}: ${result[fields[1]]}`
  }
}

export default ApplicationView
