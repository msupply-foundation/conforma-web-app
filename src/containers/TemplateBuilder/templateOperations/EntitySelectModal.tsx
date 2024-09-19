import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Header,
  Image,
  Modal,
} from 'semantic-ui-react'
import { ModalState, PreserveExistingEntities } from './useTemplateOperations'
import { useState } from 'react'

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

interface EntitySelectProps {
  open: boolean
  entities: ModifiedEntities
  onConfirm: (selected: PreserveExistingEntities) => void
}

export const EntitySelectModal: React.FC<Omit<ModalState, 'type'>> = ({
  isOpen,
  entities,
  onConfirm,
}) => {
  const [preserveCurrentSelections, setPreserveCurrentSelections] =
    useState<PreserveExistingEntities>(getInitialSelections(entities))
  return <Modal open={isOpen}></Modal>
}

const getInitialSelections = (entities?: ModifiedEntities) => {
  const initialValues: PreserveExistingEntities = {
    filters: new Set<string>(),
    permissions: new Set<string>(),
    dataViews: new Set<string>(),
    dataViewColumns: new Set<string>(),
    category: null,
    dataTables: new Set<string>(),
  }
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
