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
  Accordion,
} from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import {
  ApplicationDetails,
  ElementState,
  EvaluationOptions,
  ResponseFull,
  ResponsesByCode,
  User,
} from '../../../utils/types'
import { TemplateElement, TemplateElementCategory } from '../../../utils/generated/graphql'
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import SummaryViewWrapper from '../../SummaryViewWrapper'
import strings from '../constants'
import { evaluateElements } from '../../../utils/helpers/evaluateElements'
import { defaultEvaluatedElement } from '../../../utils/hooks/useLoadApplication'
import { useUserState } from '../../../contexts/UserState'

export enum DisplayType {
  CARDS = 'cards',
  TABLE = 'table',
  INLINE = 'inline',
}

interface InputResponseField {
  isValid?: boolean
  value: ResponseFull
}

type ListItem = { [code: string]: InputResponseField }

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onSave,
  onUpdate,
  Markdown,
  initialValue,
  currentResponse,
  applicationData,
  allResponses,
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
  } = parameters
  const {
    userState: { currentUser },
  } = useUserState()
  const [currentInputResponses, setCurrentInputResponses] = useState<ListItem>(
    resetCurrentResponses(inputFields)
  )

  const [listItems, setListItems] = useState<ListItem[]>(initialValue?.list ?? [])
  const [selectedListItem, setSelectedListItem] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [inputError, setInputError] = useState(false)

  const [currentResponseElementsState, setCurrentResponseElementsState] = useState<any>()

  useEffect(() => {
    buildElements(
      inputFields,
      allResponses,
      currentInputResponses,
      currentUser as User,
      applicationData
    ).then((elements) => setCurrentResponseElementsState(elements))
  }, [currentInputResponses])

  useEffect(() => {
    onSave({
      text: listItems.length > 0 ? createTextString(listItems, inputFields) : undefined,
      list: listItems,
    })
  }, [listItems])

  // This is sent to ApplicationViewWrapper and runs instead of the default responseMutation
  const innerElementUpdate =
    (code: string) =>
    async ({ variables: response }: { variables: InputResponseField }) => {
      // need to get most recent state of currentInputResponse, thus using callback
      setCurrentInputResponses((currentInputResponses) => {
        const newResponses = { ...currentInputResponses, [code]: response }
        if (!anyErrorItems(newResponses, inputFields)) setInputError(false)
        return newResponses
      })
    }

  const updateList = async () => {
    if (anyErrorItems(currentInputResponses, inputFields)) {
      setInputError(true)
      return
    }
    // Add item
    if (selectedListItem === null) {
      setListItems([...listItems, currentInputResponses])
    } else {
      // Or update existing item
      const newList = [...listItems]
      newList[selectedListItem] = currentInputResponses
      setListItems(newList)
    }
    resetModalState()
  }

  const editItem = async (index: number) => {
    setSelectedListItem(index)
    setCurrentInputResponses(listItems[index])
    setOpen(true)
  }

  const deleteItem = async (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index))
    resetModalState()
  }

  const resetModalState = () => {
    setCurrentInputResponses(resetCurrentResponses(inputFields))
    setOpen(false)
    setSelectedListItem(null)
    setInputError(false)
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

  let DisplayComponent
  switch (displayType) {
    case DisplayType.TABLE:
      DisplayComponent = <ListTableLayout {...listDisplayProps} />
      break
    case DisplayType.INLINE:
      listDisplayProps.inputFields = inputFields
      listDisplayProps.responses = allResponses
      listDisplayProps.currentUser = currentUser as User
      listDisplayProps.applicationData = applicationData
      DisplayComponent = <ListInlineLayout {...listDisplayProps} />
      break
    default:
      DisplayComponent = <ListCardLayout {...listDisplayProps} />
  }

  const ListInputForm = (
    <>
      <Markdown text={modalText} />
      {currentResponseElementsState &&
        inputFields.map((field: TemplateElement, index: number) => {
          const element = currentResponseElementsState?.[field.code]
          // console.log('Element', element)
          return (
            <ApplicationViewWrapper
              key={`list-${element.code}`}
              element={element}
              isStrictPage={inputError}
              allResponses={allResponses}
              currentResponse={currentInputResponses[element.code].value}
              onSaveUpdateMethod={innerElementUpdate(element.code)}
              applicationData={applicationData}
            />
          )
        })}
      <Button
        primary
        content={selectedListItem !== null ? updateButtonText : addButtonText}
        onClick={updateList}
      />
      {displayType === DisplayType.TABLE && selectedListItem !== null && (
        <Button secondary content={deleteItemText} onClick={() => deleteItem(selectedListItem)} />
      )}
      {displayType === DisplayType.INLINE && (
        <Button secondary content={strings.BUTTON_CANCEL} onClick={() => setOpen(false)} />
      )}
      {inputError && (
        <p className="alert">
          <Icon name="attention" />
          {strings.ERROR_LIST_ITEMS_NOT_VALID}
        </p>
      )}
    </>
  )

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Button
        primary
        content={createModalButtonText}
        onClick={() => setOpen(true)}
        disabled={!isEditable}
      />
      {displayType !== DisplayType.INLINE && (
        <Modal
          size="tiny"
          onClose={() => resetModalState()}
          onOpen={() => setOpen(true)}
          open={open}
        >
          <Segment>
            <Form>{ListInputForm}</Form>
          </Segment>
        </Modal>
      )}
      {displayType === DisplayType.INLINE && open && <Segment>{ListInputForm}</Segment>}
      {DisplayComponent}
    </>
  )
}

export default ApplicationView

const combineResponses = (allResponses: ResponsesByCode, currentInputResponses: ListItem) => {
  const currentResponses = Object.entries(currentInputResponses).reduce(
    (responses, [code, value]) => ({ ...responses, [code]: value?.value }),
    {}
  )
  return { ...allResponses, ...currentResponses }
}

const buildElements = async (
  fields: TemplateElement[],
  allResponses: ResponsesByCode,
  currentInputResponses: ListItem,
  currentUser: User,
  applicationData: ApplicationDetails
) => {
  const elements = fields.map((field, index) => ({
    ...defaultEvaluatedElement,
    id: index,
    code: field.code,
    pluginCode: field.elementTypePluginCode as string,
    category: field.category as TemplateElementCategory,
    title: field.title as string,
    parameters: field.parameters,
    validationExpression: field?.validation || true,
    validationMessage: field?.validationMessage || '',
    isVisibleExpression: field?.visibilityCondition || true,
    isEditableExpression: field?.isEditable || true,
    isRequiredExpression: field?.isRequired || false,
    // "Dummy" values, but required for element props:
    elementIndex: 0,
    isValid: undefined,
    page: 0,
    sectionIndex: 0,
    helpText: null,
    sectionCode: '0',
  }))
  const evaluationOptions: EvaluationOptions = ['isEditable', 'isVisible', 'isRequired']
  const evaluationObjects = {
    responses: combineResponses(allResponses, currentInputResponses),
    currentUser,
    applicationData,
  }
  const evaluatedElements = await evaluateElements(elements, evaluationOptions, evaluationObjects)
  const outputElements: { [key: string]: ElementState } = {}
  for (let i = 0; i < elements.length; i++) {
    outputElements[elements[i].code] = { ...elements[i], ...evaluatedElements[i] }
  }
  return outputElements
}

export const getDefaultDisplayFormat = (inputFields: TemplateElement[]) => {
  const displayString = inputFields.reduce(
    (acc: string, { code, title }) => acc + `**${title}**: \${${code}}  \n`,
    ''
  )
  return { title: '', subtitle: '', description: displayString }
}

const resetCurrentResponses = (inputFields: TemplateElement[]) =>
  inputFields.reduce((acc, { code }) => ({ ...acc, [code]: { value: { text: undefined } } }), {})

const anyInvalidItems = (currentInput: ListItem) =>
  Object.values(currentInput).some((response) => response.isValid === false)

const anyIncompleteItems = (currentInput: ListItem, inputFields: TemplateElement[]) =>
  Object.values(currentInput).some(
    (response, index) => inputFields[index]?.isRequired !== false && !response.value?.text
  )

const anyErrorItems = (currentInput: ListItem, inputFields: TemplateElement[]) =>
  anyInvalidItems(currentInput) || anyIncompleteItems(currentInput, inputFields)

const substituteValues = (parameterisedString: string, item: ListItem) => {
  const getValueFromCode = (_: string, $: string, code: string) => item[code]?.value?.text || ''
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getValueFromCode)
}

const createTextString = (listItems: ListItem[], inputFields: TemplateElement[]) =>
  listItems.reduce(
    (outputAcc, item) =>
      outputAcc +
      inputFields.reduce(
        (innerAcc, field) => innerAcc + `${field.title}: ${item[field.code]?.value?.text}, `,
        ''
      ) +
      '\n',
    ''
  )

// Separate components, so can be shared with SummaryView
export interface ListLayoutProps {
  listItems: ListItem[]
  displayFormat: { title?: string; subtitle?: string; description: string }
  Markdown: any
  fieldTitles?: string[]
  codes?: string[]
  editItem?: (index: number) => void
  deleteItem?: (index: number) => void
  isEditable?: boolean
  // These values required for SummaryView in Inline layout
  elements?: any
  inputFields?: any
  responses?: any
  currentUser?: User
  applicationData?: ApplicationDetails
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
              <TableCell key={`list-cell-${index}-${cellIndex}`}>{item[code].value.text}</TableCell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export const ListInlineLayout: React.FC<ListLayoutProps> = ({
  listItems,
  displayFormat,
  fieldTitles = [],
  codes = [],
  Markdown,
  editItem = () => {},
  deleteItem = () => {},
  isEditable = true,
  inputFields,
  responses,
  currentUser,
  applicationData,
}) => {
  // Inner component -- one for each Item in list
  const ItemAccordion: React.FC<any> = ({ item, header, index }) => {
    const [open, setOpen] = useState(false)
    const [currentItemElementsState, setItemResponseElementsState] = useState<any>()
    useEffect(() => {
      buildElements(
        inputFields,
        responses,
        item,
        currentUser as User,
        applicationData as ApplicationDetails
      ).then((elements) => setItemResponseElementsState(elements))
    }, [])
    if (!currentItemElementsState) return null
    return (
      <Accordion styled style={{ marginBottom: 5, marginTop: 10 }}>
        <Accordion.Title active={open} onClick={() => setOpen(!open)}>
          <Icon name="dropdown" />
          <Markdown text={substituteValues(header, item)} semanticComponent="noParagraph" />
        </Accordion.Title>
        <Accordion.Content active={open}>
          {codes.map((code, cellIndex) => (
            <SummaryViewWrapper
              key={`item_${cellIndex}`}
              element={currentItemElementsState[code]}
              response={item[code].value}
              allResponses={responses}
            />
          ))}
          <Button primary content={'EDIT'} onClick={() => editItem(index)} />
          <Button secondary content={'DELETE'} onClick={() => deleteItem(index)} />
        </Accordion.Content>
      </Accordion>
    )
  }

  return (
    <>
      {listItems.map((item, index) => (
        <ItemAccordion item={item} header={displayFormat.title} key={index} index={index} />
      ))}
    </>
  )
}
