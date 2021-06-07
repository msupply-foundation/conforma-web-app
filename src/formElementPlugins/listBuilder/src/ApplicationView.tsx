import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Segment,
  Table,
  TableHeaderCell,
  TableCell,
  Card,
  Icon,
  Label,
} from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { ElementState, EvaluationOptions, ResponsesByCode } from '../../../utils/types'
import { TemplateElement, TemplateElementCategory } from '../../../utils/generated/graphql'
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import strings from '../constants'
import { evaluateElements } from '../../../utils/helpers/evaluateElements'
import { defaultEvaluatedElement } from '../../../utils/hooks/useLoadApplication'
import { useUserState } from '../../../contexts/UserState'

export enum DisplayType {
  CARDS = 'cards',
  TABLE = 'table',
}

type InputState = {
  allResponses?: ResponsesByCode
  elements?: ElementState[]
  isOpen: boolean
  selectedItemIndex: number | null
  inputError: boolean
}

const defaultInputState: InputState = { isOpen: false, selectedItemIndex: null, inputError: false }

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  evaluatedParameters,
  onSave,
  Markdown,
  initialValue,
  applicationData,
}) => {
  const { isEditable } = element
  const {
    label,
    description,
    createModalButtonText = strings.BUTTON_LAUNCH_MODAL,
    modalText,
    addButtonText = strings.BUTTON_ADD,
    updateButtonText = strings.BUTTON_UPDATE,
    deleteItemText = strings.BUTTON_DELETE,
    inputFields,
    displayFormat = getDefaultDisplayFormat(inputFields),
    displayType = DisplayType.CARDS,
  } = evaluatedParameters

  const {
    userState: { currentUser },
  } = useUserState()
  const [inputState, setInputState] = useState<InputState>(defaultInputState)
  const [listItems, setListItems] = useState<ResponsesByCode[]>(initialValue?.list ?? [])

  useEffect(() => {
    onSave({
      text: listItems.length > 0 ? createTextString(listItems, inputFields) : undefined,
      list: listItems,
    })
  }, [listItems])

  const resetInputState = () => setInputState(defaultInputState)

  const setActiveItem = async (selectedItemIndex: number | null) => {
    const selectedItem = selectedItemIndex === null ? {} : listItems[selectedItemIndex]
    const allResponses: ResponsesByCode = {}
    const elements: ElementState[] = []

    inputFields.forEach((field: TemplateElement, index: number) => {
      elements.push(buildElement(field, index))
      if (selectedItem[field.code]) allResponses[field.code] = selectedItem[field.code]
    })

    setInputState({
      ...inputState,
      allResponses,
      elements: await _evaluateElements(allResponses, elements),
      selectedItemIndex,
      isOpen: true,
    })
  }

  const _evaluateElements = async (allResponses: ResponsesByCode, elements: ElementState[]) => {
    const evaluationOptions: EvaluationOptions = [
      'isEditable',
      'isVisible',
      'isRequired',
      'evaluatedParameters',
    ]

    const results = await evaluateElements(elements, evaluationOptions, {
      responseObject: allResponses,
      currentUser,
      applicationData,
    })

    const resultElements = results.map((evaluatedElement, index) => ({
      ...elements[index],
      ...evaluatedElement,
    }))

    return resultElements
  }

  const evaluateAndSetElements = async (
    allResponses: ResponsesByCode,
    elements: ElementState[]
  ) => {
    const newElements = await _evaluateElements(allResponses, elements)
    setInputState((currentInputState) => ({
      ...currentInputState,
      elements: newElements,
      inputError: inputError && anyErrorItems(currentInputState.allResponses || {}, elements),
    }))
  }

  // This is sent to ApplicationViewWrapper and runs instead of the default responseMutation
  const innerElementUpdate =
    (code: string) =>
    async ({ variables: response }: { variables: { value: any; isValid: boolean } }) => {
      // need to get most recent state of currentInputResponse, thus using callback
      setInputState((currentInputState) => {
        const allResponses = {
          ...currentInputState.allResponses,
          // when we built allResponse originally we've destructure value into the response
          [code]: { ...response, ...(response?.value || {}) },
        }
        evaluateAndSetElements(allResponses, currentInputState.elements || [])
        return {
          ...currentInputState,
          allResponses,
        }
      })
    }

  const updateList = async () => {
    const { allResponses = {}, selectedItemIndex, elements = [] } = inputState
    if (anyErrorItems(allResponses, elements)) {
      setInputState({ ...inputState, inputError: true })
      return
    }
    // Add item
    if (selectedItemIndex === null) {
      setListItems([...listItems, allResponses])
    } else {
      // Or update existing item
      const newList = [...listItems]
      newList[selectedItemIndex] = allResponses
      setListItems(newList)
    }
    resetInputState()
  }

  const editItem = async (index: number) => {
    setActiveItem(index)
  }

  const deleteItem = async (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index))
    resetInputState()
  }

  const listDisplayProps: ListLayoutProps = {
    listItems,
    displayFormat,
    editItem: isEditable ? editItem : () => {},
    deleteItem: isEditable ? deleteItem : () => {},
    fieldTitles: inputFields.map((e: TemplateElement) => e.title),
    codes: inputFields.map((e: TemplateElement) => e.code),
    Markdown,
    isEditable,
  }

  const DisplayComponent =
    displayType === DisplayType.TABLE ? (
      <ListTableLayout {...listDisplayProps} />
    ) : (
      <ListCardLayout {...listDisplayProps} />
    )

  const { isOpen, elements = [], allResponses = {}, inputError, selectedItemIndex } = inputState

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Button
        primary
        content={createModalButtonText}
        onClick={() => setActiveItem(null)}
        disabled={!isEditable}
      />
      <Modal size="tiny" onClose={resetInputState} open={isOpen}>
        <Segment>
          <Form>
            <Markdown text={modalText} />
            {elements.map((element) => (
              <ApplicationViewWrapper
                key={`list-${element.code}`}
                element={element}
                isStrictPage={inputError}
                allResponses={allResponses}
                currentResponse={allResponses[element.code]}
                onSaveUpdateMethod={innerElementUpdate(element.code)}
                applicationData={applicationData}
              />
            ))}
            <Button
              primary
              content={selectedItemIndex !== null ? updateButtonText : addButtonText}
              onClick={updateList}
            />
            {displayType === 'table' && selectedItemIndex !== null && (
              <Button
                secondary
                content={deleteItemText}
                onClick={() => deleteItem(selectedItemIndex)}
              />
            )}
            {inputError && (
              <p className="alert">
                <Icon name="attention" />
                {strings.ERROR_LIST_ITEMS_NOT_VALID}
              </p>
            )}
          </Form>
        </Segment>
      </Modal>
      {DisplayComponent}
    </>
  )
}

export default ApplicationView

const buildElement = (field: TemplateElement, index: number) => ({
  id: index,
  code: field.code,
  pluginCode: field.elementTypePluginCode as string,
  category: field.category as TemplateElementCategory,
  title: field.title as string,
  parameters: field.parameters,
  isEditableExpression: field.isEditable,
  isRequiredExpression: field.isRequired,
  isVisibleExpression: field.visibilityCondition,
  parametersExpressions: field.parameters,
  validationExpression: field.validation,
  validationMessage: field.validationMessage || '',
  // "Dummy" values, but required for element props:
  elementIndex: 0,
  page: 0,
  sectionIndex: 0,
  helpText: null,
  sectionCode: '0',
  ...defaultEvaluatedElement,
})

const getDefaultDisplayFormat = (inputFields: TemplateElement[]) => {
  const displayString = inputFields.reduce(
    (acc: string, { code, title }) => acc + `**${title}**: \${${code}}  \n`,
    ''
  )
  return { title: '', subtitle: '', description: displayString }
}

const anyInvalidItems = (allResponses: ResponsesByCode) =>
  Object.values(allResponses).some((response) => response.isValid === false)

const anyIncompleteItems = (allResponses: ResponsesByCode, elements: ElementState[]) =>
  elements.some((element) => element.isRequired !== false && !allResponses[element.code]?.text)

const anyErrorItems = (allResponses: ResponsesByCode, elements: ElementState[]) => {
  return anyInvalidItems(allResponses) || anyIncompleteItems(allResponses, elements)
}

const substituteValues = (parameterisedString: string, item: ResponsesByCode) => {
  const getValueFromCode = (_: string, $: string, code: string) => item[code]?.text || ''
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getValueFromCode)
}

const createTextString = (listItems: ResponsesByCode[], inputFields: TemplateElement[]) =>
  listItems.reduce(
    (outputAcc, item) =>
      outputAcc +
      inputFields.reduce(
        (innerAcc, field) => innerAcc + `${field.title}: ${item[field.code]?.text || ''}, `,
        ''
      ) +
      '\n',
    ''
  )

// Separate components, so can be shared with SummaryView
export interface ListLayoutProps {
  listItems: ResponsesByCode[]
  displayFormat: { title?: string; subtitle?: string; description: string }
  Markdown: any
  fieldTitles?: string[]
  codes?: string[]
  editItem?: (index: number) => void
  deleteItem?: (index: number) => void
  isEditable?: boolean
}

export const ListCardLayout: React.FC<ListLayoutProps> = ({
  listItems,
  displayFormat,
  editItem = () => {},
  deleteItem = () => {},
  Markdown,
  isEditable = true,
}) => {
  const { title, subtitle, description } = displayFormat
  return (
    <>
      {listItems.map((item, index) => (
        <Card key={`list-item-${index}`}>
          <Card.Content>
            {isEditable && (
              <Label floating onClick={() => deleteItem(index)}>
                <Icon name="delete" />
              </Label>
            )}
            {title && (
              <Card.Header onClick={() => editItem(index)}>
                <Markdown text={substituteValues(title, item)} semanticComponent="noParagraph" />
              </Card.Header>
            )}
            {subtitle && (
              <Card.Meta onClick={() => editItem(index)}>
                <Markdown text={substituteValues(subtitle, item)} semanticComponent="noParagraph" />
              </Card.Meta>
            )}
            {description && (
              <Card.Description onClick={() => editItem(index)}>
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

export const ListTableLayout: React.FC<ListLayoutProps> = ({
  listItems,
  fieldTitles = [],
  codes = [],
  editItem = () => {},
  // deleteItem = () => {},
  isEditable = true,
}) => {
  return (
    <Table celled selectable={isEditable}>
      <Table.Header>
        <Table.Row>
          {fieldTitles.map((title) => (
            <TableHeaderCell key={`list-header-field-${title}`}>{title}</TableHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {listItems.map((item, index) => (
          <Table.Row key={`list-row-${index}`} onClick={() => editItem(index)}>
            {codes.map((code, cellIndex) => (
              <TableCell key={`list-cell-${index}-${cellIndex}`}>
                {item[code]?.text || ''}
              </TableCell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
