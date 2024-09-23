import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Image,
  Modal,
  Confirm,
  Grid,
  GridRow,
  GridColumn,
  Checkbox,
} from 'semantic-ui-react'
import { ModalState } from './useTemplateOperations'
import { useEffect, useState } from 'react'
import { PreserveExistingEntities } from './apiOperations'

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
}) => {
  // const init = getInitialSelections(modifiedEntities)
  // console.log('INIT', init)
  const [preserveCurrentSelections, setPreserveCurrentSelections] =
    useState<PreserveExistingEntities>({
      filters: new Set(),
      permissions: new Set(),
      dataViews: new Set(),
      dataViewColumns: new Set(),
      category: 'license',
      dataTables: new Set(),
      files: new Set(),
    })

  console.log('Filters', preserveCurrentSelections)

  useEffect(() => {
    console.log('Show only run on initial')
  }, [])

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
        {/* {modifiedEntities?.category && <EntityGroup modified={modifiedEntities.category} currentlySelected={preserveCurrentSelections.category} />} */}
        {Object.keys(modifiedEntities?.filters ?? {}).length > 0 && (
          <EntityGroup
            title="Filters"
            modified={modifiedEntities?.filters ?? {}}
            currentlySelected={preserveCurrentSelections.filters}
            setSelected={setPreserveCurrentSelections}
          />
        )}
        {Object.keys(modifiedEntities?.dataViews ?? {}).length > 0 && (
          <EntityGroup
            title="Data Views"
            modified={modifiedEntities?.dataViews ?? {}}
            currentlySelected={preserveCurrentSelections.dataViews}
            setSelected={setPreserveCurrentSelections}
          />
        )}
        {Object.keys(modifiedEntities?.dataViewColumns ?? {}).length > 0 && (
          <EntityGroup
            title="Data View Columns"
            modified={modifiedEntities?.dataViewColumns ?? {}}
            currentlySelected={preserveCurrentSelections.dataViewColumns}
            setSelected={setPreserveCurrentSelections}
          />
        )}
        {Object.keys(modifiedEntities?.permissions ?? {}).length > 0 && (
          <EntityGroup
            title="Permissions"
            modified={modifiedEntities?.permissions ?? {}}
            currentlySelected={preserveCurrentSelections.permissions}
            setSelected={setPreserveCurrentSelections}
          />
        )}
        {Object.keys(modifiedEntities?.dataTables ?? {}).length > 0 && (
          <EntityGroup
            title="Data Tables"
            modified={modifiedEntities?.dataTables ?? {}}
            currentlySelected={preserveCurrentSelections.dataTables}
            setSelected={setPreserveCurrentSelections}
          />
        )}
        {/* WHAT ABOUT FILES??? */}
      </ModalContent>
    </Modal>
  )
}

interface GroupProps {
  title: string
  modified: Record<string, ComparisonObject>
  currentlySelected: Set<string>
  setSelected: React.Dispatch<React.SetStateAction<PreserveExistingEntities>>
}
const EntityGroup: React.FC<GroupProps> = ({
  title,
  modified,
  currentlySelected,
  setSelected: set,
}) => {
  return (
    <div>
      <Grid columns={2} divided>
        <GridRow>
          <Header as="h3">{title}</Header>
        </GridRow>
        <GridRow>
          <GridColumn>Incoming</GridColumn>
          <GridColumn>Current</GridColumn>
        </GridRow>
        {Object.entries(modified).map(([key, value]) => (
          <GridRow key={key}>
            <EntitySelect
              title={key}
              entity={value}
              currentlySelected={currentlySelected.has(key) ? 'current' : 'incoming'}
              setSelected={(selection: SelectionOption) => {
                const newSet = new Set(currentlySelected)
                if (selection === 'incoming') newSet.delete(key)
                else newSet.add(key)
                set((curr) => {
                  console.log('Current is', curr.filters)
                  console.log('Adding', { [title]: newSet })
                  console.log('Returning', { ...curr, [title]: newSet })
                  return { ...curr, [title]: newSet }
                })
              }}
            />
          </GridRow>
        ))}
      </Grid>
    </div>
  )
}

type SelectionOption = 'incoming' | 'current'

interface EntityProps {
  title: string
  entity: ComparisonObject
  currentlySelected: SelectionOption
  setSelected: (value: SelectionOption) => void
}
const EntitySelect: React.FC<EntityProps> = ({ title, entity, currentlySelected, setSelected }) => {
  const { incoming, current } = entity
  console.log('title', currentlySelected)
  return (
    <>
      <GridColumn>
        <div>{title}</div>
        <p>{JSON.stringify(incoming.lastModified)}</p>
        <Checkbox
          checked={currentlySelected === 'incoming'}
          onChange={() => setSelected('incoming')}
        />
      </GridColumn>
      <GridColumn>
        <div>{title}</div>
        <p>{JSON.stringify(current.lastModified)}</p>
        <Checkbox
          checked={currentlySelected === 'current'}
          onChange={() => setSelected('current')}
        />
      </GridColumn>
    </>
  )
}

const getInitialSelections = (entities?: ModifiedEntities) => {
  const initialValues: PreserveExistingEntities = {
    filters: new Set<string>(),
    permissions: new Set<string>(),
    dataViews: new Set<string>(),
    dataViewColumns: new Set<string>(),
    category: null,
    dataTables: new Set<string>(),
    files: new Set<string>(),
  }
  console.log('Getting initial', entities)
  if (!entities) return initialValues
  for (const [key, entitiesOfOneType] of Object.entries(entities)) {
    if (!entitiesOfOneType) continue
    Object.entries(entitiesOfOneType as Record<string, ComparisonObject>).forEach(
      ([code, comparison]) => {
        if (
          new Date(comparison.current.lastModified) > new Date(comparison.incoming.lastModified)
        ) {
          if (key === 'category') initialValues[key as 'category'] = code
          else initialValues[key as keyof Omit<ModifiedEntities, 'category'>]?.add(code)
        }
      }
    )
  }
  return initialValues
}
