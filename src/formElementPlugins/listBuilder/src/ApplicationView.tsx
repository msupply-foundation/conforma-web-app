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
  Markdown,
  initialValue,
  currentResponse,
  onSaveUpdateMethod,
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

  const [listItems, setListItems] = useState<any[]>([])
  const [selectedListItem, setSelectedListItem] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const innerElementUpdate = async ({ variables: response }: any) => {
    console.log(JSON.stringify(response))
    const newResponses = [...currentInputResponses]
    newResponses[response.id] = response
    setCurrentInputResponses(newResponses)
  }

  const updateList = async () => {
    console.log(currentInputResponses)
    // TO-DO: CHECK FOR VALID/REQUIRED etc before allowing into list.
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
                  {...props}
                  isStrictPage={false}
                  currentResponse={
                    selectedListItem === null
                      ? {
                          id: index,
                          text: currentInputResponses?.[index]?.value.text,
                        }
                      : { id: index, ...listItems[selectedListItem][index]?.value }
                  }
                  onSaveUpdateMethod={innerElementUpdate}
                  element={element}
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
          </Form>
        </Segment>
      </Modal>
      <p>Currently selected: {selectedListItem}</p>
      {listItems.map((item, index) => (
        <p key={`list-item-${index}`} onClick={() => editItem(index)}>
          {JSON.stringify(item)}
        </p>
      ))}
    </>
  )
}

export default ApplicationView
