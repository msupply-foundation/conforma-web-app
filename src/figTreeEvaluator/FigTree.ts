import { FigTreeEvaluator } from 'fig-tree-evaluator'
import functions from './functions'
import getServerUrl from '../utils/helpers/endpoints/endpointUrlBuilder'

// A single global instance which is passed around through the whole app

export const FigTree = new FigTreeEvaluator({
  httpClient: fetch,
  graphQLConnection: { endpoint: getServerUrl('graphQL') },
  maxCacheSize: 100,
  maxCacheTime: 600,
  evaluateFullObject: true,
  // baseEndpoint:
  functions,

  // Undocumented property to support certain V1 expressions. Remove this once
  // we're sure all evaluator queries have been updated.
  supportDeprecatedValueNodes: true,
})
