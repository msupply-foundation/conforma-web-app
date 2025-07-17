import React from 'react'
import { FigTreeEvaluator, Fragment, FragmentMetadata } from 'fig-tree-editor-react'
import { JsonEditor as ReactJson } from 'json-edit-react'

interface FragmentTesterProps {
  figTree: FigTreeEvaluator
  fragmentExpression: Fragment
  fragmentData?: {
    name: string
    metadata: FragmentMetadata | null
    frontEnd: boolean
    backEnd: boolean
  }
  onEvaluate: (result: unknown, e: React.MouseEvent<Element, MouseEvent>) => void
  onError: (err: unknown) => void
}

const getUpdatedParameters = (
  parameters: Record<string, unknown>,
  fragmentData?: FragmentTesterProps['fragmentData']
) => {
  const newValues = { ...parameters }
  fragmentData?.metadata?.parameters?.forEach((param) => {
    newValues[param.name] = param?.default ?? 'placeholder'
  })
  return newValues
}

export const FragmentTester = ({
  figTree,
  fragmentExpression,
  fragmentData,
  onEvaluate,
  onError,
}: FragmentTesterProps) => {
  const [parameters, setParameters] = React.useState<Record<string, unknown>>(
    getUpdatedParameters({}, fragmentData)
  )

  const handleEvaluate = async (e: React.MouseEvent<Element, MouseEvent>) => {
    const fragmentName = fragmentData?.name ?? '?'
    const expression = { fragment: fragmentName, parameters }
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
      <p onClick={() => setParameters(getUpdatedParameters(parameters, fragmentData))}>
        CLICK TO REFRESH PARAMS
      </p>
      <ReactJson
        data={parameters}
        setData={setParameters as (data: unknown) => void}
        rootName="parameters"
        rootFontSize={'1em'}
      />
    </div>
  )
}
