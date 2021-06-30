import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Segment, Icon } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'
import { User } from '../../../utils/types'
import { DisplayType, InputResponseField, ListItem, ListLayoutProps } from './types'
import { TemplateElement } from '../../../utils/generated/graphql'
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import {
  buildElements,
  getDefaultDisplayFormat,
  resetCurrentResponses,
  anyErrorItems,
  createTextString,
} from './helpers'
import { ListCardLayout, ListTableLayout, ListInlineLayout } from './displayComponents'
import strings from '../constants'
import { useUserState } from '../../../contexts/UserState'

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

  interface InputState {
    currentResponses: ListItem
    currentElementsState?: any
    selectedListItemIndex: number | null
    isOpen: boolean
    error: boolean
  }

  const defaultInputState: InputState = {
    currentResponses: resetCurrentResponses(inputFields),
    selectedListItemIndex: null,
    isOpen: false,
    error: false,
  }

  const [inputState, setInputState] = useState<InputState>(defaultInputState)

  // const [currentInputResponses, setCurrentInputResponses] = useState<ListItem>(
  //   resetCurrentResponses(inputFields)
  // )

  const [listItems, setListItems] = useState<ListItem[]>(initialValue?.list ?? [])
  // const [selectedListItem, setSelectedListItem] = useState<number | null>(null)
  // const [open, setOpen] = useState(false)
  // const [inputError, setInputError] = useState(false)

  // const [currentResponseElementsState, setCurrentResponseElementsState] = useState<any>()

  // console.log('currentResponseElementsState', currentResponseElementsState)

  useEffect(() => {
    console.log('Building elements')
    buildElements(
      inputFields,
      allResponses,
      inputState.currentResponses,
      currentUser as User,
      applicationData
    ).then((elements) =>
      setInputState((prevState) => ({ ...prevState, currentElementsState: elements }))
    )
  }, [inputState.currentResponses])

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
      setInputState((currentInputState) => {
        const newResponses = { ...currentInputState.currentResponses, [code]: response }
        const error = anyErrorItems(newResponses, inputFields)
        return { ...currentInputState, currentResponses: newResponses, error: error }
      })
      // setCurrentInputResponses((currentInputResponses) => {
      //   const newResponses = { ...currentInputResponses, [code]: response }
      //   if (!anyErrorItems(newResponses, inputFields)) setInputError(false)
      //   return newResponses
      // })
    }

  const updateList = async () => {
    if (anyErrorItems(inputState.currentResponses, inputFields)) {
      setInputState({ ...inputState, error: true })
      // setInputError(true)
      return
    }
    // Add item
    if (inputState.selectedListItemIndex === null) {
      setListItems([...listItems, inputState.currentResponses])
    } else {
      // Or update existing item
      const newList = [...listItems]
      newList[inputState.selectedListItemIndex] = inputState.currentResponses
      setListItems(newList)
    }
    resetFormState()
  }

  const editItem = async (index: number) => {
    // setSelectedListItem(index)
    setInputState({
      ...inputState,
      currentResponses: listItems[index],
      selectedListItemIndex: index,
      isOpen: true,
    })
    // setCurrentInputResponses(listItems[index])
    // setOpen(true)
  }

  const deleteItem = async (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index))
    resetFormState()
  }

  const resetFormState = () => {
    setInputState(defaultInputState)
    // setCurrentInputResponses(resetCurrentResponses(inputFields))
    // setOpen(false)
    // setSelectedListItem(null)
    // setInputError(false)
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
      DisplayComponent = (
        <ListInlineLayout
          {...listDisplayProps}
          inputFields={inputFields}
          responses={allResponses}
          currentUser={currentUser as User}
          applicationData={applicationData}
          editItemText={strings.BUTTON_EDIT}
          deleteItemText={deleteItemText}
        />
      )
      break
    default:
      DisplayComponent = <ListCardLayout {...listDisplayProps} />
  }

  const ListInputForm = (
    <>
      <Markdown text={modalText} />
      {inputState.currentElementsState &&
        inputFields.map((field: TemplateElement, index: number) => {
          const element = inputState.currentElementsState?.[field.code]
          return (
            <ApplicationViewWrapper
              key={`list-${element.code}`}
              element={element}
              isStrictPage={inputState.error}
              allResponses={allResponses}
              currentResponse={inputState.currentResponses[element.code].value}
              onSaveUpdateMethod={innerElementUpdate(element.code)}
              applicationData={applicationData}
            />
          )
        })}
      <Button
        primary
        content={inputState.selectedListItemIndex !== null ? updateButtonText : addButtonText}
        onClick={updateList}
      />
      {displayType === DisplayType.TABLE && inputState.selectedListItemIndex !== null && (
        <Button
          secondary
          content={deleteItemText}
          onClick={() => deleteItem(inputState.selectedListItemIndex as number)}
        />
      )}
      {displayType === DisplayType.INLINE && (
        <Button
          secondary
          content={strings.BUTTON_CANCEL}
          onClick={() => setInputState({ ...inputState, isOpen: false })}
        />
      )}
      {inputState.error && (
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
        onClick={() => setInputState({ ...inputState, isOpen: true })}
        disabled={!isEditable}
      />
      {displayType !== DisplayType.INLINE && (
        <Modal
          size="tiny"
          onClose={() => resetFormState()}
          onOpen={() => setInputState({ ...inputState, isOpen: true })}
          open={inputState.isOpen}
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
