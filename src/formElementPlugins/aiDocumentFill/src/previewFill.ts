import { evaluateElements } from '../../../utils/helpers/evaluateElements'
import { ElementState, FullStructure, ResponseFull, User } from '../../../utils/types'
import { AiFillParameters, AiFillResponse } from '../../types'
import { evaluateParameters } from './buildElements'

// The plugin whose elements compute a value from other responses
const GET_VALUES_CODE = 'getValues'
// getValues elements can depend on each other; each round settles one more
// level
const MAX_ROUNDS = 5

// A getValues element's response, as the element would save it
export interface ComputedValue {
  code: string
  responseId: number
  response: AiFillResponse
  parameters: AiFillParameters
}

export interface FillPreview {
  // Of the codes asked about, those visible with the answers applied
  visibleCodes: Set<string>
  // getValues responses that change with the answers applied
  computedValues: ComputedValue[]
}

/**
 * How the application would be with some answers applied: which questions
 * would be visible, and the values its getValues elements would compute.
 * Those elements only compute (and save) their value when their page is
 * shown, so the saved values can't be relied on: they may be missing, or
 * stale once answers change.
 */
export const previewFill = async (
  structure: FullStructure,
  currentUser: User | null,
  answers: { code: string; response: AiFillResponse }[],
  codes: string[]
): Promise<FillPreview> => {
  const elements = getElements(structure)
  const responses: Record<string, ResponseFull> = { ...structure.responsesByCode }
  for (const { code, response } of answers)
    responses[code] = { ...responses[code], ...response } as ResponseFull

  const evaluationData = () => ({
    responses,
    currentUser,
    applicationData: structure.info,
  })

  const getVisible = async (elementsToCheck: ElementState[]) => {
    const results = await evaluateElements(elementsToCheck, ['isVisible'], evaluationData())
    return elementsToCheck.filter((element, index) => results[index].isVisible ?? element.isVisible)
  }

  // Only those that read responses can change with the answers. The rest
  // (e.g. a lookup of the applicant's organisation) may fetch data, which
  // shouldn't happen every time the applicant ticks an answer.
  const getValuesElements = elements.filter(
    ({ element, response }) =>
      element.pluginCode === GET_VALUES_CODE &&
      response?.id &&
      JSON.stringify(element.parameters).includes('responses.')
  )
  const computedValues = new Map<string, ComputedValue>()

  for (let round = 0; round < MAX_ROUNDS; round++) {
    // Hidden elements aren't shown, so don't compute
    const visible = new Set(
      (await getVisible(getValuesElements.map(({ element }) => element))).map(({ code }) => code)
    )
    let changed = false
    for (const { element, response } of getValuesElements) {
      if (!visible.has(element.code)) continue
      const computed = await computeValue(element, responses[element.code], evaluationData())
      if (!computed || computed.response.text === responses[element.code]?.text) continue
      responses[element.code] = {
        ...responses[element.code],
        ...computed.response,
      } as ResponseFull
      computedValues.set(element.code, {
        code: element.code,
        responseId: (response as ResponseFull).id,
        ...computed,
      })
      changed = true
    }
    if (!changed) break
  }

  const askedAbout = elements
    .filter(({ element }) => codes.includes(element.code))
    .map(({ element }) => element)
  const visibleCodes = new Set((await getVisible(askedAbout)).map(({ code }) => code))

  return { visibleCodes, computedValues: [...computedValues.values()] }
}

const getElements = (structure: FullStructure) =>
  Object.values(structure.sections).flatMap(({ pages }) =>
    Object.values(pages).flatMap(({ state }) => state)
  )

// As the getValues element computes its value when mounted: its `default`,
// or else its `values`. Undefined if that doesn't evaluate.
const computeValue = async (
  element: ElementState,
  response: ResponseFull | undefined,
  data: Parameters<typeof evaluateParameters>[2]
) => {
  try {
    const parameters = await evaluateParameters(element, response, data)
    const value = parameters.default ?? parameters.values
    if (value === undefined) return undefined
    return { response: { text: JSON.stringify(value), data: value }, parameters }
  } catch (err) {
    console.log(`AI document fill: can't compute ${element.code}`, err)
    return undefined
  }
}
