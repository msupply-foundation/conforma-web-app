import { getRequest } from '../../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FigTreeEvaluator } from 'fig-tree-editor-react'
import { FigTree } from '../../../../FigTreeEvaluator'

/**
 * Load a separate instance of FigTreeEvaluator for Actions, as it needs to be
 * loaded with different Fragments (back-end ones).
 *
 * This is *only* used in the Template Builder for Action configuration, and
 * requires Admin permission.
 */

const originalFigTreeOptions = FigTree.getOptions()

export const FigTreeActions = new FigTreeEvaluator({
  ...originalFigTreeOptions,
  // Actions can use all operators
  excludeOperators: [],
})

// Replace the fragments with the back-end ones
export const figTreeActionsReady = getRequest(
  getServerUrl('figTreeFragments', { frontOrBack: 'backEnd' })
).then((fragments) => {
  FigTreeActions.updateOptions({ fragments })
})
