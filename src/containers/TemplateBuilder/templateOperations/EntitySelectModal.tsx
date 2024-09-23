import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Modal,
  Grid,
  GridRow,
  GridColumn,
  Checkbox,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from 'semantic-ui-react'
import { ModalState } from './useTemplateOperations'
import { useState } from 'react'
import { PreserveExistingEntities, PreserveExistingInput } from './apiOperations'

interface Entity {
  checksum: string
  lastModified: string // ISO Date
  data: Record<string, unknown>
}

interface ComparisonObject {
  incoming: Entity
  current: Entity
}

export interface ModifiedEntities {
  filters: Record<string, ComparisonObject>
  permissions: Record<string, ComparisonObject>
  dataViews: Record<string, ComparisonObject>
  dataViewColumns: Record<string, ComparisonObject>
  category: Record<string, ComparisonObject>
  dataTables: Record<string, ComparisonObject>
}

export const EntitySelectModal: React.FC<Omit<ModalState, 'type'>> = ({
  isOpen,
  modifiedEntities,
  onConfirm,
  close,
}) => {
  const [preserveCurrentSelections, setPreserveCurrentSelections] =
    useState<PreserveExistingEntities>(getInitialSelections(modifiedEntities))

  const updateState = (
    key: keyof PreserveExistingEntities,
    value: string,
    operation: 'add' | 'remove' = 'add'
  ) =>
    setPreserveCurrentSelections((current) => {
      const newValues = new Set(current[key])
      if (operation === 'add') newValues.add(value)
      else newValues.delete(value)
      return { ...current, [key]: newValues }
    })

  return (
    <Modal open={isOpen}>
      <ModalHeader>Import Template</ModalHeader>
      <ModalContent>
        <ModalDescription>
          <p>
            The following entities connected to this template are already in the system, but are
            different from what you are about to import.
          </p>
          <p>
            Please review them carefully and select the one you wish to keep. If you select the{' '}
            <strong>import</strong> entity, the current system one will be overwritten. However, if
            the <strong>current system</strong> entity is selected, the template may not behave
            exactly as expected.
          </p>
          <p>
            By default, the <em>newest</em> version of each is selected.
          </p>
        </ModalDescription>
        <Table stackable>
          <TableBody>
            {modifiedEntities?.category && (
              <EntityGroup
                title="Category"
                group="category"
                modified={modifiedEntities.category}
                currentlySelected={new Set(preserveCurrentSelections.category)}
                updateState={updateState}
              />
            )}
            {Object.keys(modifiedEntities?.filters ?? {}).length > 0 && (
              <EntityGroup
                title="Filters"
                group="filters"
                modified={modifiedEntities?.filters ?? {}}
                currentlySelected={preserveCurrentSelections.filters}
                updateState={updateState}
              />
            )}
            {Object.keys(modifiedEntities?.dataViews ?? {}).length > 0 && (
              <EntityGroup
                title="Data Views"
                group="dataViews"
                modified={modifiedEntities?.dataViews ?? {}}
                currentlySelected={preserveCurrentSelections.dataViews}
                updateState={updateState}
              />
            )}
            {Object.keys(modifiedEntities?.dataViewColumns ?? {}).length > 0 && (
              <EntityGroup
                title="Data View Columns"
                group="dataViewColumns"
                modified={modifiedEntities?.dataViewColumns ?? {}}
                currentlySelected={preserveCurrentSelections.dataViewColumns}
                updateState={updateState}
              />
            )}
            {Object.keys(modifiedEntities?.permissions ?? {}).length > 0 && (
              <EntityGroup
                title="Permissions"
                group="permissions"
                modified={modifiedEntities?.permissions ?? {}}
                currentlySelected={preserveCurrentSelections.permissions}
                updateState={updateState}
              />
            )}
            {Object.keys(modifiedEntities?.dataTables ?? {}).length > 0 && (
              <EntityGroup
                title="Data Tables"
                group="dataTables"
                modified={modifiedEntities?.dataTables ?? {}}
                currentlySelected={preserveCurrentSelections.dataTables}
                updateState={updateState}
              />
            )}
            {/* WHAT ABOUT FILES??? */}
          </TableBody>
        </Table>
      </ModalContent>
      <ModalActions>
        <Button onClick={close} content="Cancel" />
        <Button
          onClick={() => onConfirm(prepareForImport(preserveCurrentSelections))}
          primary
          content="Install"
        />
      </ModalActions>
    </Modal>
  )
}

interface GroupProps {
  title: string
  group: keyof PreserveExistingEntities
  modified: Record<string, ComparisonObject>
  currentlySelected: Set<string>
  updateState: (
    key: keyof PreserveExistingEntities,
    value: string,
    operation?: 'add' | 'remove'
  ) => void
}
const EntityGroup: React.FC<GroupProps> = ({
  title,
  group,
  modified,
  currentlySelected,
  updateState,
}) => {
  return (
    <>
      <TableRow>
        <TableCell colspan={2}>
          <Header as="h3">{title}</Header>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>Incoming</TableCell>
        <TableCell>Current</TableCell>
      </TableRow>
      {Object.entries(modified).map(([key, value]) => (
        <TableRow key={key}>
          <EntitySelect
            title={key}
            entity={value}
            currentlySelected={currentlySelected.has(key) ? 'current' : 'incoming'}
            updateState={(item, operation) => updateState(group, item, operation)}
          />
        </TableRow>
      ))}
    </>
  )
}

type SelectionOption = 'incoming' | 'current'

interface EntityProps {
  title: string
  entity: ComparisonObject
  currentlySelected: SelectionOption
  updateState: (value: string, operation?: 'add' | 'remove') => void
}
const EntitySelect: React.FC<EntityProps> = ({ title, entity, currentlySelected, updateState }) => {
  const { incoming, current } = entity
  return (
    <>
      <TableCell>
        <div>{title}</div>
        <p>{JSON.stringify(incoming.lastModified)}</p>
        <Checkbox
          checked={currentlySelected === 'incoming'}
          onChange={() => updateState(title, 'remove')}
        />
      </TableCell>
      <TableCell>
        <div>{title}</div>
        <p>{JSON.stringify(current.lastModified)}</p>
        <Checkbox checked={currentlySelected === 'current'} onChange={() => updateState(title)} />
      </TableCell>
    </>
  )
}

const getInitialSelections = (entities?: ModifiedEntities) => {
  const initialValues: PreserveExistingEntities = {
    filters: new Set<string>(),
    permissions: new Set<string>(),
    dataViews: new Set<string>(),
    dataViewColumns: new Set<string>(),
    category: new Set<string>(),
    dataTables: new Set<string>(),
    files: new Set<string>(),
  }
  if (!entities) return initialValues
  for (const [key, entitiesOfOneType] of Object.entries(entities)) {
    if (!entitiesOfOneType) continue
    Object.entries(entitiesOfOneType as Record<string, ComparisonObject>).forEach(
      ([code, comparison]) => {
        if (new Date(comparison.current.lastModified) > new Date(comparison.incoming.lastModified))
          initialValues[key as keyof Omit<ModifiedEntities, 'category'>]?.add(code)
      }
    )
  }
  return initialValues
}

const prepareForImport = (preserveCurrent: PreserveExistingEntities): PreserveExistingInput =>
  Object.entries(preserveCurrent).reduce((acc, [key, values]) => {
    const valuesAsArray = Array.from(values)
    if (key === 'category' && valuesAsArray.length > 0)
      return { ...acc, category: valuesAsArray[0] }
    if (valuesAsArray.length > 0) return { ...acc, [key]: valuesAsArray }
    return acc
  }, {})
