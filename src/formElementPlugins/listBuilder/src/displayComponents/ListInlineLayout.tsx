import React, { useEffect, useState } from 'react'
import { Button, Icon, Accordion } from 'semantic-ui-react'
import { ApplicationDetails, User } from '../../../../utils/types'
import { ListLayoutProps } from '../types'
import ApplicationViewWrapper from '../../../ApplicationViewWrapper'
import SummaryViewWrapper from '../../../SummaryViewWrapper'
import { buildElements, substituteValues } from '../helpers'
import '../styles.css'

const ListInlineLayout: React.FC<ListLayoutProps> = (props) => {
  const { listItems, displayFormat } = props
  return (
    <>
      {listItems.map((item, index) => (
        <ItemAccordion key={index} item={item} header={displayFormat.title} {...props} />
      ))}
    </>
  )
}

export default ListInlineLayout

// Inner component -- one for each Item in list
const ItemAccordion: React.FC<any> = ({
  item,
  header,
  index,
  inputFields,
  responses,
  currentUser,
  applicationData,
  Markdown,
  codes,
  editItem,
  deleteItem,
  editItemText,
  updateButtonText,
  deleteItemText,
  innerElementUpdate,
  updateList,
}) => {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
  const [currentItemElementsState, setItemResponseElementsState] = useState<any>()

  const editItemInline = () => {
    setEdit(true)
    editItem(index)
  }

  const updateListInline = () => {
    updateList()
    setEdit(false)
  }

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
    <Accordion styled className="accordion-container" style={{ maxWidth: open ? 'none' : '100%' }}>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name="dropdown" />
        <Markdown text={substituteValues(header, item)} semanticComponent="noParagraph" />
      </Accordion.Title>
      <Accordion.Content active={open}>
        {codes.map((code: string, cellIndex: number) =>
          edit ? (
            <ApplicationViewWrapper
              key={`list-${cellIndex}`}
              element={currentItemElementsState[code]}
              isStrictPage={false}
              allResponses={responses}
              currentResponse={item[code].value}
              onSaveUpdateMethod={innerElementUpdate(currentItemElementsState[code].code)}
              applicationData={applicationData}
            />
          ) : (
            <SummaryViewWrapper
              key={`item_accordion_${cellIndex}`}
              element={currentItemElementsState[code]}
              response={item[code].value}
              allResponses={responses}
            />
          )
        )}
        {!edit && <Button primary content={editItemText} onClick={editItemInline} />}
        {edit && <Button primary content={updateButtonText} onClick={updateListInline} />}
        <Button secondary content={deleteItemText} onClick={() => deleteItem(index)} />
      </Accordion.Content>
    </Accordion>
  )
}
