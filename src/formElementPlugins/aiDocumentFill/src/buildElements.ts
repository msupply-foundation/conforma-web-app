import { EvaluatorNode } from 'fig-tree-evaluator'
import { FigTree } from '../../../FigTreeEvaluator'
import { buildParameters } from '../../ApplicationViewWrapper'
import { PluginProvider } from '../../pluginProvider'
import { TemplateElementCategory } from '../../../utils/generated/graphql'
import { ElementState, FullStructure, ResponseFull, User } from '../../../utils/types'
import { ExtractionElement } from './types'

// The element types the server's extraction can answer
const SUPPORTED_PLUGINS = [
  'shortText',
  'longText',
  'number',
  'datePicker',
  'dropdownChoice',
  'radioChoice',
  'checkbox',
]

interface EvaluationData {
  responses: FullStructure['responsesByCode']
  currentUser: User | null
  applicationData: FullStructure['info']
}

/**
 * Describes the application's questions for the extraction endpoint: the
 * visible, editable questions of supported types, limited to `scope` (section
 * or element codes) if given.
 */
export const buildElements = async (
  structure: FullStructure,
  currentUser: User | null,
  scope?: string | string[]
): Promise<ExtractionElement[]> => {
  const scopeCodes = typeof scope === 'string' ? [scope] : scope
  const data: EvaluationData = {
    responses: structure.responsesByCode,
    currentUser,
    applicationData: structure.info,
  }

  const targets = Object.values(structure.sections)
    .flatMap(({ pages }) => Object.values(pages).flatMap(({ state }) => state))
    .filter(
      ({ element }) =>
        element.category === TemplateElementCategory.Question &&
        SUPPORTED_PLUGINS.includes(element.pluginCode) &&
        element.isVisible &&
        element.isEditable &&
        (!scopeCodes ||
          scopeCodes.includes(element.code) ||
          scopeCodes.includes(element.sectionCode))
    )

  const elements = await Promise.all(
    targets.map(({ element, response }) => buildElement(element, response, data))
  )
  return elements.filter((element): element is ExtractionElement => !!element)
}

// Undefined for an element that can't be described: its parameters didn't
// evaluate, or it's a choice element whose options can't be shown as text
const buildElement = async (
  element: ElementState,
  response: ResponseFull | null,
  data: EvaluationData
): Promise<ExtractionElement | undefined> => {
  const { code, pluginCode, title, helpText, isRequired } = element

  let parameters: Record<string, unknown>
  try {
    parameters = await evaluateParameters(element, response, data)
  } catch (err) {
    console.log(`AI document fill: can't evaluate parameters of ${code}`, err)
    return undefined
  }

  const label = typeof parameters.label === 'string' ? stripMarkdown(parameters.label) : ''
  const description = typeof parameters.description === 'string' ? parameters.description : ''
  const fullHelpText = [description, helpText].filter(Boolean).join('\n\n')

  const definition: ExtractionElement = {
    code,
    pluginCode,
    title: label || title,
    isRequired,
    ...(fullHelpText ? { helpText: fullHelpText } : {}),
    ...(response?.text ? { currentValue: response.text } : {}),
  }

  const getChoices = PluginProvider[pluginCode].aiFill?.getChoices
  if (!getChoices) return definition

  const choices = getChoices(parameters)
  if (!choices?.options.length) return undefined
  return { ...definition, ...choices }
}

// As ApplicationViewWrapper evaluates them for a mounted element
const evaluateParameters = async (
  element: ElementState,
  response: ResponseFull | null,
  { responses, currentUser, applicationData }: EvaluationData
) => {
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
