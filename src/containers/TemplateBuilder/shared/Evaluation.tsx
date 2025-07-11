import React, { useState } from 'react'
import { JsonEditor as ReactJson, IconDelete, IconEdit } from 'json-edit-react'
import TextIO from './TextIO'
import { EvaluatorNode } from 'fig-tree-evaluator'
import { FigTree } from '../../../FigTreeEvaluator'
import { getFigTreeSummary } from '../../../FigTreeEvaluator/FigTree'
import { EvaluationEditor } from '../../../components/common/EvaluationEditor'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast } from '../../../contexts/Toast'
import { handleCopyToClipboard } from '../../../components/Admin/JsonEditor'

type EvaluationProps = {
  evaluation: EvaluatorNode
  setEvaluation: (evaluation: EvaluatorNode) => void
  label: string
  updateKey?: (key: string) => void
  deleteKey?: () => void
  objectData: Record<string, unknown>
  canEdit: boolean
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
  updateKey,
  deleteKey,
  canEdit,
  objectData,
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
            <IconDelete size="1.4em" style={{ color: 'rgb(203, 75, 22)' }} />
          </span>
        )}
        {updateKey && (
          <span onClick={() => setIsEditingKey(true)} title="Edit Key">
            <IconEdit size="1.4em" />
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
            figTree={FigTree}
            objectData={objectData}
            canEdit={canEdit}
            rootName={label}
            collapse={0}
            onCollapse={({ path, collapsed }) => {
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
  const { t } = useLanguageProvider()
  const { showToast } = useToast()

  if (!objectData) return null

  return (
    <div className="object-properties-container">
      <ReactJson
        data={objectData}
        rootName="data"
        collapse={1}
        indent={2}
        maxWidth={450}
        restrictEdit={true}
        restrictDelete={true}
        restrictAdd={true}
        theme={{ container: ['transparent', { fontSize: '13px', padding: 0 }] }}
        enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
      />
    </div>
  )
}

export default Evaluation
