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
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import strings from '../constants'

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
    createModalButtonText = 'Add item',
    modalText,
    addButtonText,
    updateButtonText = 'Update',
    displayFormat,
    inputFields,
    displayType = 'table',
  } = parameters

  const [currentInputResponses, setCurrentInputResponses] = useState<any[]>(
    resetCurrentResponses(inputFields)
  )

  const [listItems, setListItems] = useState<any[]>(initialValue?.list ?? [])
  const [selectedListItem, setSelectedListItem] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [inputError, setInputError] = useState(false)

  useEffect(() => {
    onSave({
      text: createTextString(listItems),
      list: listItems,
    })
  }, [listItems])

  // This is sent to ApplicationViewWrapper and runs instead of the default responseMutation
  const innerElementUpdate = async ({ variables: response }: any) => {
    const newResponses = [...currentInputResponses]
    newResponses[response.id] = response
    setCurrentInputResponses(newResponses)
    if (!anyErrorItems(newResponses, inputFields)) setInputError(false)
  }

  const updateList = async () => {
    if (anyErrorItems(currentInputResponses, inputFields)) {
      setInputError(true)
      return
    }
    console.log(buildListItem(currentInputResponses, inputFields))
    // Add item
    if (selectedListItem === null)
      setListItems([...listItems, buildListItem(currentInputResponses, inputFields)])
    else {
      // Or update existing item
      const newList = [...listItems]
      newList[selectedListItem] = buildListItem(currentInputResponses, inputFields)
      setListItems(newList)
    }
    setCurrentInputResponses(resetCurrentResponses(inputFields))
    setOpen(false)
    setSelectedListItem(null)
  }

  const editItem = async (index: number) => {
    setSelectedListItem(index)
    setCurrentInputResponses(listItems[index])
    setOpen(true)
  }

  const deleteItem = async (index: number) => {
    setListItems(listItems.filter((_: any, i: number) => i !== index))
    setOpen(false)
    setCurrentInputResponses(resetCurrentResponses(inputFields))
  }

  const listDisplayProps = {
    listItems,
    displayFormat,
    editItem,
    deleteItem,
    fieldTitles: inputFields.map((e: any) => e.title),
    Markdown,
  }

  const DisplayComponent =
    displayType === 'table' ? (
      <ListTableLayout {...listDisplayProps} />
    ) : (
      <ListCardLayout {...listDisplayProps} />
    )

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Modal
        size="tiny"
        // closeIcon
        onClose={() => {
          setOpen(false)
          setSelectedListItem(null)
          setCurrentInputResponses(resetCurrentResponses(inputFields))
          setInputError(false)
        }}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button primary content={createModalButtonText} />}
      >
        <Segment>
          <Form>
            <Markdown text={modalText} />
            {inputFields.map((field: any, index: number) => {
              const element = {
                code: field.code,
                pluginCode: field.elementTypePluginCode,
                category: field.category,
                title: field.title,
                parameters: field.parameters,
                isEditable: true, // Update
                isRequired: field.isRequired ?? true,
                isVisible: true,
                validationExpression: field?.validation || true,
                validationMessage: field?.validationMessage || '',
                id: index, // This is the only link between element and the response
                elementIndex: 0,
                page: 0,
                sectionIndex: 0,
                helpText: null,
                sectionCode: '0',
              }
              return (
                <ApplicationViewWrapper
                  key={`list-${element.code}`}
                  element={element}
                  isStrictPage={inputError}
                  allResponses={allResponses}
                  currentResponse={
                    selectedListItem === null
                      ? {
                          id: index,
                          code: element.code,
                          text: currentInputResponses?.[index]?.value.text,
                        }
                      : { id: index, code: element.code, ...currentInputResponses?.[index]?.value }
                  }
                  onSaveUpdateMethod={innerElementUpdate}
                  applicationData={applicationData}
                />
              )
            })}
            <Button
              primary
              content={selectedListItem !== null ? updateButtonText : addButtonText || 'Add'}
              onClick={updateList}
            />
            {displayType === 'table' && selectedListItem !== null && (
              <Button
                secondary
                content={'Delete item'}
                onClick={() => deleteItem(selectedListItem)}
              />
            )}
            {inputError && <p>{strings.ERROR_LIST_ITEMS_NOT_VALID}</p>}
          </Form>
        </Segment>
      </Modal>
      {DisplayComponent}
    </>
  )
}

export default ApplicationView

const createTextString = (listItems: any) => {
  return 'Temp text value'
}

const resetCurrentResponses = (inputFields: any) =>
  new Array(inputFields.length).fill({ value: { text: undefined } })

const buildListItem = (item: any, inputFields: any) =>
  item.map((field: any, index: number) => ({
    code: inputFields[index].code,
    id: field.id,
    title: inputFields[index].title,
    value: field.value,
  }))

const anyInvalidItems = (currentInput: any) =>
  currentInput.some((response: any) => response.isValid === false)

const anyIncompleteItems = (currentInput: any, inputFields: any) =>
  currentInput.some(
    (response: any, index: number) =>
      inputFields[index]?.isRequired !== false && !response.value.text
  )

const anyErrorItems = (currentInput: any, inputFields: any) =>
  anyInvalidItems(currentInput) || anyIncompleteItems(currentInput, inputFields)

const substituteValues = (parameterisedString: string, item: any) => {
  const getValueFromCode = (_: string, $: string, code: string) =>
    item.find((field: any) => field.code === code).value.text || ''
  return parameterisedString.replace(/(\${)(.*?)(})/gm, getValueFromCode)
}

// Separate components, so can be shared with SummaryView
export const ListCardLayout: React.FC<any> = ({
  listItems,
  displayFormat,
  editItem = () => {},
  deleteItem = () => {},
  Markdown,
}: any) => {
  const { header, meta, description } = displayFormat
  return listItems.map((item: any, index: number) => (
    <Card key={`list-item-${index}`}>
      <Card.Content>
        <Label floating onClick={() => deleteItem(index)}>
          <Icon name="delete" />
        </Label>
        {header && (
          <Card.Header onClick={() => editItem(index)}>
            <Markdown text={substituteValues(header, item)} semanticComponent="noParagraph" />
          </Card.Header>
        )}
        {meta && (
          <Card.Meta onClick={() => editItem(index)}>
            <Markdown text={substituteValues(meta, item)} semanticComponent="noParagraph" />
          </Card.Meta>
        )}
        {description && (
          <Card.Description onClick={() => editItem(index)}>
            <Markdown text={substituteValues(description, item)} semanticComponent="noParagraph" />
          </Card.Description>
        )}
      </Card.Content>
    </Card>
  ))
}

export const ListTableLayout: React.FC<any> = ({
  listItems,
  fieldTitles,
  editItem = () => {},
  deleteItem = () => {},
}: any) => {
  return (
    <Table celled selectable>
      <Table.Header>
        <Table.Row>
          {fieldTitles.map((title: string) => (
            <TableHeaderCell key={`list-header-field-${title}`}>{title}</TableHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {listItems.map((item: any, index: number) => (
          <Table.Row key={`list-row-${index}`} onClick={() => editItem(index)}>
            {item.map((cell: any, cellIndex: number) => (
              <TableCell key={`list-cell-${index}-${cellIndex}`}>
                {cell?.value?.text || ''}
              </TableCell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
