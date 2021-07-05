import React, { useEffect, useState } from 'react'
import { Button, Icon, Accordion } from 'semantic-ui-react'
import { ApplicationDetails, User } from '../../../../utils/types'
import { ListLayoutProps } from '../types'
import ApplicationViewWrapper from '../../../ApplicationViewWrapper'
import SummaryViewWrapper from '../../../SummaryViewWrapper'
import { buildElements, substituteValues } from '../helpers'
import '../styles.css'

const ListInlineLayout: React.FC<ListLayoutProps> = ({
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
  ListInputForm,
}) => {
  return (
    <>
      {listItems.map((item, index) => (
        <ItemAccordion
          item={item}
          header={displayFormat.title}
          key={index}
          index={index}
          inputFields={inputFields}
          responses={responses}
          currentUser={currentUser}
          applicationData={applicationData}
          Markdown={Markdown}
          codes={codes}
          editItem={editItem}
          deleteItem={deleteItem}
          ListInputForm={ListInputForm}
        />
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
  ListInputForm,
}) => {
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)
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
    <Accordion styled className="accordion-container" style={{ maxWidth: open ? 'none' : '100%' }}>
      <Accordion.Title active={open} onClick={() => setOpen(!open)}>
        <Icon name="dropdown" />
        <Markdown text={substituteValues(header, item)} semanticComponent="noParagraph" />
      </Accordion.Title>
      {!edit && (
        <Accordion.Content active={open}>
          {codes.map((code: string, cellIndex: number) => (
            <SummaryViewWrapper
              key={`item_accordion_${cellIndex}`}
              element={currentItemElementsState[code]}
              response={item[code].value}
              allResponses={responses}
            />
          ))}
          <Button primary content={'EDIT'} onClick={() => setEdit(true)} />
          <Button secondary content={'DELETE'} onClick={() => deleteItem(index)} />
        </Accordion.Content>
      )}
      {edit && <p>Editing</p>}
    </Accordion>
  )
}
