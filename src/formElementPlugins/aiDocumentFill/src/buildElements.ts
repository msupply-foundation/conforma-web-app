import { EvaluatorNode } from 'fig-tree-evaluator'
import { FigTree } from '../../../FigTreeEvaluator'
import { buildParameters } from '../../ApplicationViewWrapper'
import { PluginProvider } from '../../pluginProvider'
import { AiFillParameters } from '../../types'
import { TemplateElementCategory } from '../../../utils/generated/graphql'
import { ElementState, FullStructure, ResponseFull, User } from '../../../utils/types'
import { ExtractionElement } from './types'

// A question that can be filled, with what's needed to save its answer
export interface FillTarget {
  definition: ExtractionElement
  pluginCode: string
  parameters: AiFillParameters // evaluated, saved with the response
  responseId: number
}

export interface EvaluationData {
  responses: FullStructure['responsesByCode']
  currentUser: User | null
  applicationData: FullStructure['info']
}

/**
 * The application's questions that can be filled: editable questions whose
 * plugin provides `aiFill`, limited to `scope` (section or element codes) if
 * given. Hidden questions are included, as the answers may reveal them (see
 * previewFill), unless their visibility is fixed at false.
 */
export const buildElements = async (
  structure: FullStructure,
  currentUser: User | null,
  scope?: string | string[]
): Promise<FillTarget[]> => {
  const scopeCodes = typeof scope === 'string' ? [scope] : scope
  const data: EvaluationData = {
    responses: structure.responsesByCode,
    currentUser,
    applicationData: structure.info,
  }

  const candidates = Object.values(structure.sections)
    .flatMap(({ pages }) => Object.values(pages).flatMap(({ state }) => state))
    .filter(
      ({ element, response }) =>
        element.category === TemplateElementCategory.Question &&
        PluginProvider[element.pluginCode]?.aiFill &&
        (element.isVisible || element.isVisibleExpression !== false) &&
        element.isEditable &&
        response?.id &&
        (!scopeCodes ||
          scopeCodes.includes(element.code) ||
          scopeCodes.includes(element.sectionCode))
    )

  const targets = await Promise.all(
    candidates.map(({ element, response }) => buildTarget(element, response as ResponseFull, data))
  )
  return targets.filter((target): target is FillTarget => !!target)
}

// Undefined for an element that can't be filled: its parameters didn't
// evaluate, or its plugin can't fill it as it's configured
const buildTarget = async (
  element: ElementState,
  response: ResponseFull,
  data: EvaluationData
): Promise<FillTarget | undefined> => {
  const { code, pluginCode, title, helpText, isRequired } = element

  let parameters: AiFillParameters
  try {
    parameters = await evaluateParameters(element, response, data)
  } catch (err) {
    console.log(`AI document fill: can't evaluate parameters of ${code}`, err)
    return undefined
  }

  const describe = PluginProvider[pluginCode].aiFill?.describe
  const description = describe ? describe(parameters) : {}
  if (!description) return undefined

  const label = typeof parameters.label === 'string' ? stripMarkdown(parameters.label) : ''
  const elementDescription =
    typeof parameters.description === 'string' ? parameters.description : ''
  const fullHelpText = [elementDescription, helpText].filter(Boolean).join('\n\n')

  return {
    definition: {
      code,
      pluginCode,
      title: label || title,
      isRequired,
      ...(fullHelpText ? { helpText: fullHelpText } : {}),
      ...(response.text ? { currentValue: response.text } : {}),
      ...description,
    },
    pluginCode,
    parameters,
    responseId: response.id,
  }
}

// As ApplicationViewWrapper evaluates them for a mounted element
export const evaluateParameters = async (
  element: ElementState,
  response: ResponseFull | undefined,
  { responses, currentUser, applicationData }: EvaluationData
): Promise<AiFillParameters> => {
  const { config } = PluginProvider[element.pluginCode]
  const [simpleParameters, parameterExpressions] = buildParameters(
    element.parameters,
    config.parameterLoadingValues,
    config.internalParameters ?? []
  )
  const evaluated = await Promise.all(
    Object.entries(parameterExpressions).map(async ([field, expression]) => [
      field,
      await FigTree.evaluate(expression as EvaluatorNode, {
        data: {
          responses: { ...responses, thisResponse: response?.text },
          currentUser,
          applicationData,
        },
      }),
    ])
  )
  return { ...simpleParameters, ...Object.fromEntries(evaluated) }
}

// Enough for a question label, which is short and at most has emphasis, a
// link or a heading
const stripMarkdown = (text: string) =>
  text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/(\*\*|__|\*|_|`|~~)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
