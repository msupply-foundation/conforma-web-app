import { EvaluatorNode } from 'fig-tree-evaluator'
import { AiFillMethods, AiFillParameters } from '../../types'
import { TemplateElement } from '../../../utils/generated/graphql'
import { ResponseFull } from '../../../utils/types'
import { buildDataArray, createTextString, resetCurrentResponses } from './helpers'
import { ListItem } from './types'

const getFields = ({ inputFields }: AiFillParameters) =>
  Array.isArray(inputFields) ? (inputFields as TemplateElement[]) : []

const describe = ({ maxItems }: AiFillParameters) =>
  typeof maxItems === 'number' ? { maxItems } : {}

// As the list builder saves its items: each field's response converted by its
// own plugin, with the fields that weren't answered left empty, as in a new
// item. Rows beyond maxItems are left out.
const fromPlainValue: AiFillMethods['fromPlainValue'] = async (
  value,
  parameters,
  { fields = [], evaluationData = {} }
) => {
  if (!Array.isArray(value)) return undefined
  const inputFields = getFields(parameters)
  const fieldsByCode = new Map(fields.map((field) => [field.code, field]))

  const list: ListItem[] = []
  for (const row of value) {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) continue
    const item: ListItem = resetCurrentResponses(inputFields)
    let hasAnswers = false
    for (const [code, fieldValue] of Object.entries(row)) {
      const response = await fieldsByCode.get(code)?.fill(fieldValue)
      if (!response) continue
      // An item holds each field's value only, without a saved response's id
      item[code] = { value: response as unknown as ResponseFull, isValid: true }
      hasAnswers = true
    }
    if (hasAnswers) list.push(item)
  }

  const { maxItems, textFormat, dataFormat } = parameters
  const items = typeof maxItems === 'number' ? list.slice(0, maxItems) : list
  if (items.length === 0) return undefined

  return {
    text: createTextString(items, inputFields, textFormat as string | undefined),
    list: items,
    data: await buildDataArray(
      items,
      inputFields,
      evaluationData,
      dataFormat as string | EvaluatorNode | undefined
    ),
  }
}

export const aiFill: AiFillMethods = { describe, getFields, fromPlainValue }
