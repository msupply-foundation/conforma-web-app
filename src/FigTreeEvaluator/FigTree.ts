import {
  EvaluatorNode,
  FigTreeEvaluator,
  FragmentNode,
  isFigTreeExpression,
  isFragmentNode,
  isObject,
  isOperatorNode,
  OperatorNode,
  truncateString,
} from 'fig-tree-editor-react'
import { functions } from './customFunctions'
import getServerUrl, { serverREST } from '../utils/helpers/endpoints/endpointUrlBuilder'
import { getRequest } from '../utils/helpers/fetchMethods'

// A single global instance which is passed around through the whole app

export const FigTree = new FigTreeEvaluator({
  graphQLConnection: { endpoint: getServerUrl('graphQL') },
  maxCacheSize: 100,
  maxCacheTime: 60 * 30, // 30 minutes
  evaluateFullObject: true,
  baseEndpoint: serverREST,
  functions,
  excludeOperators: ['SQL'],

  // Undocumented property to support certain V1 expressions. Remove this once
  // we're sure all evaluator queries have been updated.

  // supportDeprecatedValueNodes: true,
})

export const defaultNewOperatorExpression = {
  operator: 'getData',
  property: 'path.to.value',
  fallback: null,
}

// Called by "UserState" context whenever a user logs in
export const loadFragments = async () => {
  getRequest(getServerUrl('figTreeFragments', { frontOrBack: 'frontEnd' })).then((fragments) => {
    FigTree.updateOptions({ fragments })
  })
}

// Text summary of the type of node for parameters UI
export const getFigTreeSummary = (expression: EvaluatorNode) => {
  if (isOperatorNode(expression))
    return { type: 'Operator', operator: (expression as OperatorNode)['operator'] }
  if (isFragmentNode(expression))
    return { type: 'Fragment', fragment: (expression as FragmentNode)['fragment'] }
  // If it's a FT Expression, but not an operator or fragment, it's a shorthand
  if (isFigTreeExpression(expression))
    return { type: 'Shorthand', value: Object.keys(expression as object)[0] }

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
