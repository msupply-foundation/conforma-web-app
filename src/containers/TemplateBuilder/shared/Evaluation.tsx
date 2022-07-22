import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
import { truncate } from 'lodash'
import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import { Accordion, Icon, Label } from 'semantic-ui-react'
import config from '../../../config'
import { useUserState } from '../../../contexts/UserState'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FullStructure } from '../../../utils/types'
import { renderEvaluation } from '../evaluatorGui/renderEvaluation'
import semanticComponentLibrary from '../evaluatorGui/semanticComponentLibrary'
import { getTypedEvaluation, getTypedEvaluationAsString } from '../evaluatorGui/typeHelpers'
import CheckboxIO from './CheckboxIO'
import JsonIO from './JsonIO'
import TextIO from './TextIO'

type EvaluationProps = {
  evaluation: EvaluatorNode
  currentElementCode: string
  setEvaluation: (evaluation: EvaluatorNode) => void
  fullStructure?: FullStructure // for Form Elements
  applicationData?: any // for Actions
  label: string
  updateKey?: (key: string) => void
  deleteKey?: () => void
  type?: 'FormElement' | 'Action'
}

type EvaluationHeaderProps = {
  evaluation: EvaluatorNode
}

export const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({ evaluation }) => {
  const typedEvaluation = getTypedEvaluation(evaluation)

  return (
    <div className="flex-row-start-center" style={{ marginTop: 6 }}>
      <TextIO title="Type" text={typedEvaluation.type} />
      {typedEvaluation.type === 'operator' && (
        <TextIO title="operator" text={typedEvaluation.asOperator.operator} />
      )}

      {typedEvaluation.type !== 'operator' && (
        <TextIO
          title="Value"
          text={truncate(getTypedEvaluationAsString(typedEvaluation), { length: 80 })}
        />
      )}
    </div>
  )
}

const Evaluation: React.FC<EvaluationProps> = ({
  evaluation,
  setEvaluation,
  label,
  currentElementCode,
  fullStructure,
  applicationData,
  updateKey,
  deleteKey,
  type,
}) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [isActive, setIsActive] = useState(false)
  const [asGui, setAsGui] = useState(true)
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const objects =
    type === 'Action'
      ? { applicationData }
      : type === 'FormElement'
      ? {
          responses: {
            ...fullStructure?.responsesByCode,
            thisResponse: fullStructure?.responsesByCode?.[currentElementCode]?.text,
          },
          currentUser,
          applicationData: fullStructure?.info,
        }
      : undefined

  const evaluationParameters = {
    objects,
    APIfetch: fetch,
    graphQLConnection: {
      fetch: fetch.bind(window),
      endpoint: getServerUrl('graphQL'),
    },
    headers: { Authorization: 'Bearer ' + JWT },
  }

  return (
    <Accordion className="evaluation-container">
      <Accordion.Title className="evaluation-container-title flex-gap-10" active={isActive}>
        {!updateKey && label && (
          <Label style={{ minWidth: 120, textAlign: 'center' }}>{label}</Label>
        )}
        {deleteKey && (
          <Icon
            className="clickable left-margin-space-10"
            name="window close"
            onClick={deleteKey}
          />
        )}
        {updateKey && (
          <div className="flex-row-start-center" style={{ marginTop: 6 }}>
            <TextIO
              title="Parameter Name"
              text={label}
              setText={updateKey as (key: string | null) => void}
            />
          </div>
        )}
        <EvaluationHeader evaluation={evaluation} />
        <div className="flex-row-end">
          <Icon
            size="large"
            name={isActive ? 'angle up' : 'angle down'}
            onClick={() => setIsActive(!isActive)}
          />
        </div>
      </Accordion.Title>
      {isActive && (
        <Accordion.Content className="evaluation-container-content" active={isActive}>
          <>
            <div className="flex-column-start-center">
              <div style={{ marginLeft: 30 }}>
                <CheckboxIO title="Show As GUI" value={asGui} setValue={setAsGui} />
                <div className="spacer-10" />
              </div>
              {!asGui && (
                <div className="long">
                  <JsonIO
                    isPropUpdated={true}
                    object={asObject(evaluation)}
                    label="Plugin Parameters"
                    setObject={(value) => setEvaluation(value)}
                  />
                </div>
              )}
              {asGui &&
                renderEvaluation(
                  evaluation,
                  (evaluation) => setEvaluation(evaluation),
                  semanticComponentLibrary,
                  evaluationParameters
                )}
            </div>
            {objects && (
              <div className="object-properties-container">
                <Label>Object Properties</Label>
                <div className="spacer-20" />
                <ReactJson src={objects} collapsed={1} />
              </div>
            )}
          </>
        </Accordion.Content>
      )}
    </Accordion>
  )
}

export const asObject = (value: EvaluatorNode) =>
  typeof value === 'object' && value !== null
    ? value
    : { value: value || (value === false ? false : null) }

export default Evaluation
