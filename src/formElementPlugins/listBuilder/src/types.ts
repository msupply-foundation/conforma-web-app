import { TemplateElement } from '../../../utils/generated/graphql'
import { ApplicationDetails, ResponseFull, User } from '../../../utils/types'

export enum DisplayType {
  CARDS = 'cards',
  TABLE = 'table',
  INLINE = 'inline',
  LIST = 'list',
}

export interface ListBuilderParameters {
  label?: string
  description?: string
  createModalButtonText?: string
  modalText?: string
  addButtonText?: string
  updateButtonText?: string
  deleteItemText?: string
  inputFields: TemplateElement[]
  displayFormat?: { title: string; subtitle: string; description: string }
  displayType?: DisplayType
  default?: ResponseFull
  inlineOpen?: boolean
  tableExcludeColumns?: string[]
  maxItems?: number
  // These affect mobile viewing only
  hideFromMobileTableIfEmpty?: true | string[]
  minMobileTableLabelWidth?: number | string
  maxMobileTableLabelWidth?: number | string
}

export interface InputResponseField {
  isValid?: boolean
  value: ResponseFull
}

export type ListItem = { [code: string]: InputResponseField }

export interface ListLayoutProps {
  listItems: ListItem[]
  displayFormat: { title?: string; subtitle?: string; description: string }
  Markdown: any
  editItem?: (index: number) => void
  deleteItem?: (index: number) => void
  isEditable?: boolean
  // These properties required for Inline layout
  inputFields: TemplateElement[]
  responses?: any
  currentUser?: User
  applicationData?: ApplicationDetails
  editItemText?: string
  deleteItemText?: string
  updateButtonText?: string
  innerElementUpdate?: (code: string) => void
  updateList?: () => void
  // These properties optional and affect Tables on Mobile
  hideFromMobileIfEmpty?: boolean | string[]
  minMobileLabelWidth?: number | string
  maxMobileLabelWidth?: number | string
}
