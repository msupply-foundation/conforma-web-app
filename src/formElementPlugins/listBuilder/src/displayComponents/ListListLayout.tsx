import React from 'react'
import { Icon, List, ListItem } from 'semantic-ui-react'
import { ListLayoutProps } from '../types'
import { substituteValues } from '../helpers'

const ListListLayout: React.FC<ListLayoutProps> = ({
  listItems,
  displayFormat,
  // editItem = () => {},
  deleteItem = () => {},
  Markdown,
  isEditable = true,
}) => {
  const { title, description } = displayFormat
  return (
    <List bulleted={listItems.length > 1}>
      {listItems.map((item, index) => (
        <>
          <ListItem className="list-list-item" style={{ marginTop: 5 }}>
            <div className="flex-row-start">
              {title ? (
                <Markdown text={substituteValues(title, item)} semanticComponent="noParagraph" />
              ) : description ? (
                <Markdown
                  text={substituteValues(description, item)}
                  semanticComponent="noParagraph"
                />
              ) : (
                ''
              )}
              {isEditable && (
                <Icon
                  className="list-list-item-icon"
                  link
                  name="close"
                  circular
                  size="small"
                  color="blue"
                  onClick={() => deleteItem(index)}
                  style={{ position: 'relative', top: -2, left: 5 }}
                />
              )}
            </div>
          </ListItem>
        </>
      ))}
    </List>
  )
}

export default ListListLayout
