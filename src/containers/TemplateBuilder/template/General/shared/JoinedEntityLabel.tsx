import { Icon, Label } from 'semantic-ui-react'

interface JoinedEntityLabelProps {
  joinId: number
  name: string
  description?: JSX.Element
  canEdit: boolean
  selected: boolean
  inaccessible: boolean
  inTemplateElements: boolean
  inActions: boolean
  editLink: string
  setSelected: (id?: number) => void
  setMenu: (id?: number) => void
}

export const JoinedEntityLabel = ({
  joinId,
  name,
  description,
  canEdit,
  selected,
  inaccessible,
  inTemplateElements,
  inActions,
  editLink,
  setSelected,
  setMenu,
}: JoinedEntityLabelProps) => {
  return (
    <Label
      className={`${canEdit ? 'clickable' : ''}${selected ? ' builder-selected' : ''}${
        inaccessible
          ? ' entity-trim-inaccessible'
          : inTemplateElements
          ? ' entity-trim-elements'
          : inActions
          ? ' entity-trim-output'
          : ''
      }`}
      style={{ fontSize: '100%', position: 'relative' }}
      onClick={() => {
        if (!canEdit) return
        if (selected) setSelected(undefined)
        else {
          setSelected(joinId)
          setMenu(undefined)
        }
      }}
    >
      <div className="ext-icon clickable" onClick={() => window.open(editLink, '_blank')}>
        <Icon name="external" size="small" className="floating-icon clickable" />
      </div>
      {name}
      <br />
      <span className="slightly-smaller-text" style={{ fontWeight: 400 }}>
        {description}
      </span>
    </Label>
  )
}
