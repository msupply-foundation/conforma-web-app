import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { FigTreeEvaluator } from 'fig-tree-editor-react'
import { ReactJsonView } from '../../../components/Admin/JsonEditor'
import TextIO from './TextIO'
import { EvaluatorNode } from 'fig-tree-evaluator'
import { getFigTreeSummary } from '../../../FigTreeEvaluator/FigTree'
import { EvaluationEditor } from '../../../components/common/EvaluationEditor'

type EvaluationProps = {
  figTree: FigTreeEvaluator
  evaluation: EvaluatorNode
  setEvaluation: (evaluation: EvaluatorNode) => void
  label: string
  updateKey?: (key: string) => void
  deleteKey?: () => void
  objectData: Record<string, unknown>
  canEdit: boolean
  resetExpression?: (expression: EvaluatorNode) => void
}

type EvaluationHeaderProps = { evaluation: EvaluatorNode }

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
  updateKey,
  deleteKey,
  canEdit,
  objectData,
  figTree,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)

  const changeKey = updateKey
    ? (key: string) => {
        updateKey(key)
        setIsEditingKey(false)
      }
    : () => {}

  return (
    <div
      className="evaluation-container flex-row-start-center"
      style={{
        paddingLeft: isExpanded ? '1em' : '0.5em',
        paddingTop: isExpanded ? '0.6em' : '0.2em',
        paddingBottom: isExpanded ? '0.6em' : '0.2em',
      }}
    >
      <div
        className="flex-row"
        style={{
          gap: '0.6em',
          marginRight: deleteKey || updateKey ? '1em' : 0,
          display: isExpanded ? 'none' : 'inherit',
        }}
      >
        {deleteKey && (
          <span onClick={deleteKey}>
            <Icon
              name="trash alternate"
              style={{ color: 'rgb(203, 75, 22)', fontSize: '1.2em', margin: 0 }}
            />
          </span>
        )}
        {updateKey && (
          <span onClick={() => setIsEditingKey(true)} title="Edit Key">
            <Icon name="pencil" style={{ color: 'grey', fontSize: '1.2em', margin: 0 }} />
          </span>
        )}
      </div>
      {!isEditingKey ? (
        <div
          className="flex-row-space-between"
          style={{ gap: '1em', marginLeft: deleteKey || updateKey ? 0 : '1em' }}
        >
          <EvaluationEditor
            expression={evaluation}
            setExpression={setEvaluation}
            figTree={figTree}
            objectData={objectData}
            canEdit={canEdit}
            rootName={label}
            // This ensures that the expression first loads fully collapsed, but
            // has a depth of 2 when first opened
            collapse={isExpanded ? 2 : 0}
            onCollapse={({ path, collapsed }) => {
              // The "isExpanded" state is updated when the user opens or closes
              // the *root* of the evaluation expression
              if (path.length === 0) {
                setIsExpanded(!collapsed)
              }
            }}
          />
          {isExpanded && <ObjectDataDisplay objectData={objectData} />}
        </div>
      ) : (
        <input
          style={{ marginLeft: '1em' }}
          type="text"
          name={label}
          defaultValue={label}
          autoFocus
          onFocus={(e) => e.target.select()}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') {
              changeKey((e.target as HTMLInputElement).value)
            } else if (e.key === 'Escape') {
              setIsEditingKey(false)
            }
          }}
          onBlur={(e) => {
            changeKey((e.target as HTMLInputElement).value)
          }}
        />
      )}
    </div>
  )
}

interface ObjectDataDisplayProps {
  objectData?: Record<string, unknown>
}

export const ObjectDataDisplay: React.FC<ObjectDataDisplayProps> = ({ objectData }) => {
  if (!objectData) return null

  return (
    <div className="object-properties-container">
      <ReactJsonView
        data={objectData}
        rootName="data"
        collapse={1}
        indent={2}
        maxWidth={450}
        theme={{ container: ['transparent', { fontSize: '13px', padding: 0 }] }}
      />
    </div>
  )
}

export default Evaluation
