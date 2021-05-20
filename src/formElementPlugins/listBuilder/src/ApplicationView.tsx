import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Segment, Container } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import strings from '../constants'
import config from '../pluginConfig.json'
import { TemplateElementCategory } from '../../../utils/generated/graphql'

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  onSave,
  onUpdate,
  Markdown,
  initialValue,
  currentResponse,
  ...props
}) => {
  const { isEditable } = element
  const {
    label,
    description,
    createModalButtonText,
    modalText,
    addButtonText,
    updateButtonText,
    displayString,
    inputFields,
  } = parameters

  const [currentInputResponses, setCurrentInputResponses] = useState<any[]>([])

  const [listItems, setListItems] = useState<any[]>(
    initialValue?.list ? getInitialListState(initialValue.list) : []
  )
  const [selectedListItem, setSelectedListItem] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [invalidItem, setInvalidItem] = useState(false)

  useEffect(() => {
    onSave({
      text: createTextString(listItems),
      list: constructListResponse(listItems, inputFields),
    })
  }, [listItems])

  const innerElementUpdate = async ({ variables: response }: any) => {
    console.log(JSON.stringify(response))
    const newResponses = [...currentInputResponses]
    newResponses[response.id] = response
    setCurrentInputResponses(newResponses)
  }

  const updateList = async () => {
    // TO-DO: CHECK FOR VALID/REQUIRED etc before allowing into list.
    if (anyInvalidItems(currentInputResponses)) {
      console.log('Some invalid')
      setInvalidItem(true)
      return
    }
    if (selectedListItem === null) setListItems([...listItems, currentInputResponses])
    else {
      console.log('UPDATING')
      // update existing item
      const newList = [...listItems]
      newList[selectedListItem] = currentInputResponses
      setListItems(newList)
    }
    setCurrentInputResponses([])
    setOpen(false)
    setSelectedListItem(null)
  }

  const editItem = async (index: number) => {
    setSelectedListItem(index)
    console.log('Edit item ' + index)
    console.log('listItems[index] ' + JSON.stringify(listItems[index]))
    setCurrentInputResponses(listItems[index])
    setOpen(true)
  }

  const deleteItem = async (index: number) => {
    setListItems(listItems.filter((_: any, i: number) => i !== index))
  }

  return (
    <>
      <label>
        <Markdown text={label} semanticComponent="noParagraph" />
      </label>
      <Markdown text={description} />
      <Modal
        size="mini"
        // closeIcon
        onClose={() => {
          setOpen(false)
          setSelectedListItem(null)
          setCurrentInputResponses([])
          setInvalidItem(false)
        }}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button primary content={createModalButtonText || 'Add item'} />}
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
                  isStrictPage={false}
                  allResponses={props.allResponses}
                  currentResponse={
                    selectedListItem === null
                      ? {
                          id: index,
                          text: currentInputResponses?.[index]?.value.text,
                        }
                      : { id: index, ...currentInputResponses?.[index]?.value }
                  }
                  onSaveUpdateMethod={innerElementUpdate}
                  applicationData={props.applicationData}
                />
              )
            })}
            <Button
              primary
              content={
                selectedListItem !== null ? updateButtonText || 'Update' : addButtonText || 'Add'
              }
              onClick={updateList}
            />
            {invalidItem && <p>Invalid item!</p>}
          </Form>
        </Segment>
      </Modal>
      {listItems.map((item, index) => (
        <p key={`list-item-${index}`}>
          <span onClick={() => editItem(index)}>{JSON.stringify(item)}</span>
          <br />
          <span onClick={() => deleteItem(index)}>Delete</span>
        </p>
      ))}
    </>
  )
}

export default ApplicationView

const createTextString = (listItems: any) => {
  return 'Temp text value'
}

const constructListResponse = (listItems: any, inputFields: any) =>
  listItems.map((item: any) =>
    item.map((field: any, index: number) => ({
      code: inputFields[index].code,
      title: inputFields[index].title,
      value: field.value,
    }))
  )

const getInitialListState = (listResponse: any) => {
  if (!listResponse) return null
  return listResponse.map((item: any) =>
    item.map((field: any, index: number) => ({ id: index, value: field.value }))
  )
}

const anyInvalidItems = (currentInput: any) =>
  currentInput.some((response: any) => {
    console.log(response)
    return response.isValid === false
  })
