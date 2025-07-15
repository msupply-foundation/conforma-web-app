import { getRequest } from '../../../../utils/helpers/fetchMethods'
import getServerUrl, { serverREST } from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FigTreeEvaluator } from 'fig-tree-editor-react'
import { functions } from '../../../../FigTreeEvaluator'

/**
 * Load a separate instance of FigTreeEvaluator for Actions, as it needs to be
 * loaded with different Fragments (back-end ones).
 *
 * This is *only* used in the Template Builder for Action configuration, and
 * requires Admin permission.
 */
export const FigTreeActions = new FigTreeEvaluator({
  graphQLConnection: { endpoint: getServerUrl('graphQL') },
  maxCacheSize: 100,
  maxCacheTime: 600,
  evaluateFullObject: true,
  baseEndpoint: serverREST,
  functions,
  // excludeOperators: ['SQL'],
})

getRequest(getServerUrl('figTreeFragments', { frontOrBack: 'backEnd' })).then((fragments) => {
  FigTreeActions.updateOptions({ fragments })
})
