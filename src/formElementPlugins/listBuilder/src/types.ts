import { TemplateElement } from '../../../utils/generated/graphql'
import { ApplicationDetails, ResponseFull, User } from '../../../utils/types'

export enum DisplayType {
  CARDS = 'cards',
  TABLE = 'table',
  INLINE = 'inline',
  LIST = 'list',
}

export interface InputResponseField {
  isValid?: boolean
  isRequired?: boolean
  value: ResponseFull
}

export type ListItem = { [code: string]: InputResponseField }

export interface ListViewParams {
  label: string
  description: string
  createModalButtonText?: string
  modalText?: string
  addButtonText?: string
  updateButtonText?: string
  deleteItemText?: string
  inputFields: TemplateElement[]
  displayFormat: { title: string; subtitle: string; description: string }
  displayType: DisplayType
}

export interface ListLayoutProps {
  listItems: ListItem[]
  displayFormat: { title?: string; subtitle?: string; description: string }
  Markdown: any
  fieldTitles?: string[]
  codes?: string[]
  editItem?: (index: number) => void
  deleteItem?: (index: number) => void
  isEditable?: boolean
  // These properties required for Inline layout
  inputFields?: any
  responses?: any
  currentUser?: User
  applicationData?: ApplicationDetails
  editItemText?: string
  deleteItemText?: string
  updateButtonText?: string
  innerElementUpdate?: (code: string) => void
  updateList?: () => void
}
