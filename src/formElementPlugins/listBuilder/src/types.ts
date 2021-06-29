import { ApplicationViewProps } from '../../types'
import {
  ApplicationDetails,
  ElementState,
  EvaluationOptions,
  ResponseFull,
  ResponsesByCode,
  User,
} from '../../../utils/types'
import { TemplateElement, TemplateElementCategory } from '../../../utils/generated/graphql'
import ApplicationViewWrapper from '../../ApplicationViewWrapper'
import SummaryViewWrapper from '../../SummaryViewWrapper'
import strings from '../constants'
import { evaluateElements } from '../../../utils/helpers/evaluateElements'
import { defaultEvaluatedElement } from '../../../utils/hooks/useLoadApplication'
import { useUserState } from '../../../contexts/UserState'

export enum DisplayType {
  CARDS = 'cards',
  TABLE = 'table',
  INLINE = 'inline',
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
  fieldTitles?: string[]
  codes?: string[]
  editItem?: (index: number) => void
  deleteItem?: (index: number) => void
  isEditable?: boolean
  // These values required for SummaryView in Inline layout
  elements?: any
  inputFields?: any
  responses?: any
  currentUser?: User
  applicationData?: ApplicationDetails
  editItemText?: string
  deleteItemText?: string
}
