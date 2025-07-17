import React, { useEffect } from 'react'
import {
  EvaluatorNode,
  FigTreeEvaluator,
  Fragment,
  FragmentParameterMetadata,
} from 'fig-tree-editor-react'
import { JsonEditor as ReactJson } from 'json-edit-react'

interface FragmentTesterProps {
  figTree: FigTreeEvaluator
  fragmentExpression: Fragment
  fragmentData?: {
    name: string
    metadata: object | null
    frontEnd: boolean
    backEnd: boolean
  }
  onEvaluate: (result: unknown, e: React.MouseEvent<Element, MouseEvent>) => void
  onError: (err: unknown) => void
}

export const FragmentTester = ({
  figTree,
  fragmentExpression,
  fragmentData,
  onEvaluate,
  onError,
}: FragmentTesterProps) => {
  const [parameterValues, setParameterValues] = React.useState<Record<string, unknown>>({})

  useEffect(() => {
    const newValues: Record<string, unknown> = {}
    fragmentData?.metadata?.parameters.forEach((param) => {
      newValues[param.name] = param?.default ?? 'placeholder'
    })
    setParameterValues(newValues)
  }, [])

  const handleEvaluate = async (e: React.MouseEvent<Element, MouseEvent>) => {
    const fragmentName = fragmentData?.name ?? '?'
    const expression = { fragment: fragmentName, parameters: parameterValues }
    const fragments = { [fragmentName]: fragmentExpression }

    console.log('Expression', expression)
    console.log('Fragments', fragments)

    try {
      const result = await figTree.evaluate(expression, { fragments })
      onEvaluate(result, e)
    } catch (err) {
      onError(err)
    }
  }

  return (
    <div className="flex-row">
      <p onClick={handleEvaluate}>CLICK ME</p>
      <ReactJson data={parameterValues} setData={setParameterValues} />
    </div>
  )
}
