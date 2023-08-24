import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import figTree from '../../../components/FigTreeEvaluator'
import { useFigTreeContext } from './FigTreeContext'

type NodeType = 'operator' | 'fragment' | 'value'

const nodeTypeOptions = [
  { key: 'operator', text: 'Operator', value: 'operator' },
  { key: 'fragment', text: 'Fragment', value: 'fragment' },
  { key: 'value', text: 'Value', value: 'value' },
]

const operators = figTree.getOperators()
const fragments = figTree.getFragments()
const functions = figTree.getCustomFunctions()

const operatorOptions = operators.map((op) => ({
  key: op.operator,
  text: `${op.operator}: ${op.description}`,
  value: op.operator,
}))

export const FigTreeNode: React.FC<{ path: string }> = ({ path }) => {
  const [nodeType, setNodeType] = useState<NodeType>('operator')
  console.log('Operators', operators)
  const { expression, update, evaluate } = useFigTreeContext()

  return (
    <div className="flex-column-center-start">
      <Dropdown
        selection
        value={nodeType}
        onChange={(_, { value }) => setNodeType(value as NodeType)}
        options={nodeTypeOptions}
      />
      {nodeType === 'operator' && <Operator />}
    </div>
  )
}

interface OperatorProps {}

export const Operator: React.FC<OperatorProps> = () => {
  return <p>TEST</p>
}
