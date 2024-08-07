import React from 'react'
import { Card, Icon, Label } from 'semantic-ui-react'
import { substituteValues } from '../../../../utils/helpers/utilityFunctions'
import { ListLayoutProps } from '../types'

const ListCardLayout: React.FC<ListLayoutProps> = ({
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
                <Markdown
                  text={substituteValues(title, item, index)}
                  semanticComponent="noParagraph"
                />
              </Card.Header>
            )}
            {subtitle && (
              <Card.Meta onClick={() => editItem(index)}>
                <Markdown
                  text={substituteValues(subtitle, item, index)}
                  semanticComponent="noParagraph"
                />
              </Card.Meta>
            )}
            {description && (
              <Card.Description onClick={() => editItem(index)}>
                <Markdown
                  text={substituteValues(description, item, index)}
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

export default ListCardLayout
