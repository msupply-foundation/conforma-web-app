import React, { useEffect, useState } from 'react'
import { Button, Icon, Accordion } from 'semantic-ui-react'
import { ApplicationDetails, ElementState, User } from '../../../../utils/types'
import { ListItem, ListLayoutProps } from '../types'
import ApplicationViewWrapper from '../../../ApplicationViewWrapper'
import SummaryViewWrapper from '../../../SummaryViewWrapper'
import { buildElements } from '../helpers'
import { substituteValues } from '../../../../utils/helpers/utilityFunctions'
import '../styles.less'

const ListInlineLayout: React.FC<ListLayoutProps> = (props) => {
  const { listItems, displayFormat } = props
  return (
    <>
      {listItems.map((item, index) => (
        <ItemAccordion
          key={`${displayFormat.title}-${index}`}
          index={index}
          item={item}
          header={displayFormat.title}
          {...props}
        />
      ))}
    </>
  )
}
export default ListInlineLayout

interface ItemAccordionProps extends ListLayoutProps {
  item: ListItem
  header: string | undefined
  index: number
}
// Inner component -- one for each Item in list
const ItemAccordion: React.FC<ItemAccordionProps> = ({
  item,
  header = '',
  index,
  inputFields,
  isEditable = true,
  responses,
  currentUser,
  applicationData,
  Markdown,
  codes = [],
  editItem = (index: number, value: boolean) => {},
  deleteItem = (index: number) => {},
  editItemText,
  updateButtonText,
  deleteItemText,
  innerElementUpdate = () => {},
  updateList = () => {},
}) => {
  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentItemElementsState, setItemResponseElementsState] = useState<{
    [key: string]: ElementState
  }>()

  const editItemInline = () => {
    setIsEditing(true)
    editItem(index, false)
  }

  const updateListInline = () => {
    updateList()
    setIsEditing(false)
  }

  const deleteItemInline = () => {
    deleteItem(index)
    setIsEditing(false)
    setOpen(false)
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
    <Accordion
      styled
      fluid={open ? false : true}
      className="accordion-container fit-content"
      style={{ maxWidth: open ? 'none' : '100%' }}
    >
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name="dropdown" />
        <Markdown text={substituteValues(header, item)} semanticComponent="noParagraph" />
      </Accordion.Title>
      <Accordion.Content active={open}>
        {codes.map((code: string, cellIndex: number) =>
          isEditing ? (
            <ApplicationViewWrapper
              key={`list-${cellIndex}`}
              element={currentItemElementsState[code]}
              isStrictPage={false}
              allResponses={responses}
              currentResponse={item[code].value}
              onSaveUpdateMethod={
                innerElementUpdate(currentItemElementsState[code].code) as Function | undefined
              }
              applicationData={applicationData as ApplicationDetails}
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
        {!isEditing && isEditable && (
          <Button primary content={editItemText} onClick={editItemInline} />
        )}
        {isEditing && <Button primary content={updateButtonText} onClick={updateListInline} />}
        {isEditable && <Button secondary content={deleteItemText} onClick={deleteItemInline} />}
      </Accordion.Content>
    </Accordion>
  )
}
