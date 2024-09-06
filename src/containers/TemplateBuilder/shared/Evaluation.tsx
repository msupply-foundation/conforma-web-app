import React, { useState } from 'react'
import { JsonEditor as ReactJson } from 'json-edit-react'
import { Accordion, Icon, Label } from 'semantic-ui-react'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import functions from '../../../figTreeEvaluator/functions'
import TextIO from './TextIO'
import { EvaluatorNode } from 'fig-tree-evaluator'
import { FigTreeEditor } from 'fig-tree-builder-react'
import FigTree from '../../../figTreeEvaluator'
import { getFigTreeSummary } from '../../../figTreeEvaluator/FigTree'

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
  const figTreeSummary = getFigTreeSummary(evaluation)

  return (
    <div className="flex-row-start-center" style={{ marginTop: 6 }}>
      <TextIO title="Type" text={figTreeSummary.type} />
      {figTreeSummary.type === 'Operator' && (
        <TextIO title="Operator" text={figTreeSummary.operator} />
      )}
      {figTreeSummary.type === 'Fragment' && (
        <TextIO title="Fragment" text={figTreeSummary.fragment} />
      )}
      {'value' in figTreeSummary && <TextIO title="Value" text={figTreeSummary.value} />}
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
  const data =
    type === 'Action'
      ? { applicationData, functions }
      : type === 'FormElement'
      ? {
          responses: {
            ...fullStructure?.responsesByCode,
            thisResponse: fullStructure?.responsesByCode?.[currentElementCode]?.text,
          },
          currentUser,
          applicationData: { ...fullStructure?.info, currentPageType: 'application' },
          functions,
        }
      : undefined

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
            <FigTreeEditor
              expression={evaluation}
              figTree={FigTree}
              objectData={data as object}
              onUpdate={({ newData }) => {
                setEvaluation(newData)
              }}
              onEvaluate={(result) => console.log('RESULT', result)}
              rootName="expression"
            />
            {data && (
              <div className="object-properties-container">
                <Label>Object Properties</Label>
                <ReactJson
                  data={data}
                  rootName="data"
                  collapse={1}
                  indent={1}
                  maxWidth={450}
                  restrictEdit={true}
                  restrictDelete={true}
                  restrictAdd={true}
                  theme={{ container: ['transparent', { fontSize: '13px', padding: 0 }] }}
                />
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
