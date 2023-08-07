import {
  FigTreeEvaluator,
  FigTreeOptions,
  EvaluatorNode,
  EvaluatorOutput,
} from 'fig-tree-evaluator'
import functions from './customFunctions'
import fragments from './fragments'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import config from '../../config'

export const options: FigTreeOptions = {
  functions,
  fragments,
  graphQLConnection: { endpoint: getServerUrl('graphQL') },
  nullEqualsUndefined: true,
  supportDeprecatedValueNodes: true,
}

const figTree = new FigTreeEvaluator(options)

const JWT = localStorage.getItem(config.localStorageJWTKey)
if (JWT) figTree.updateOptions({ headers: { Authorization: 'Bearer ' + JWT } })

export default figTree

export { EvaluatorNode, EvaluatorOutput }
