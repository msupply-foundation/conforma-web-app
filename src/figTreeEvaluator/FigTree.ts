import {
  EvaluatorNode,
  FigTreeEvaluator,
  FragmentNode,
  isAliasString,
  isFragmentNode,
  isObject,
  isOperatorNode,
  OperatorNode,
  truncateString,
} from 'fig-tree-evaluator'
import functions from './functions'
import getServerUrl from '../utils/helpers/endpoints/endpointUrlBuilder'

// A single global instance which is passed around through the whole app

export const FigTree = new FigTreeEvaluator({
  httpClient: fetch,
  graphQLConnection: { endpoint: getServerUrl('graphQL') },
  maxCacheSize: 100,
  maxCacheTime: 600,
  evaluateFullObject: true,
  baseEndpoint: getServerUrl('REST'),
  functions,

  // Undocumented property to support certain V1 expressions. Remove this once
  // we're sure all evaluator queries have been updated.
  supportDeprecatedValueNodes: true,
})

export const isFigTreeExpression = (input: EvaluatorNode) => {
  if (isOperatorNode(input) || isFragmentNode(input)) return true
  if (typeof input === 'string' && isAliasString(input)) return true
  if (isObject(input) && Object.keys(input).length === 1 && isAliasString(Object.keys(input)[0]))
    return true

  return false
}

export const getFigTreeSummary = (expression: EvaluatorNode) => {
  if (isOperatorNode(expression))
    return { type: 'Operator', operator: (expression as OperatorNode)['operator'] }
  if (isFragmentNode(expression))
    return { type: 'Fragment', fragment: (expression as FragmentNode)['fragment'] }

  const STRING_TRUNCATE_VALUE = 50

  switch (typeof expression) {
    case 'string':
    case 'number':
    case 'boolean':
      return {
        type: typeof expression,
        value: truncateString(String(expression), STRING_TRUNCATE_VALUE),
      }
    case 'object':
      if (expression === null) return { type: 'null', value: 'null' }
      if (Array.isArray(expression))
        return {
          type: 'array',
          value: truncateString(JSON.stringify(expression), STRING_TRUNCATE_VALUE),
        }
      if (isObject(expression))
        return {
          type: 'object',
          value: truncateString(JSON.stringify(expression), STRING_TRUNCATE_VALUE),
        }
  }
  return { type: 'unknown', value: truncateString(String(expression), STRING_TRUNCATE_VALUE) }
}
