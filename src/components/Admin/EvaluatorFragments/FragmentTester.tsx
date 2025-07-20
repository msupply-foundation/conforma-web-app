import React, { useEffect } from 'react'
import { FigTreeEvaluator, Fragment } from 'fig-tree-editor-react'
import { ReactJson } from '../JsonEditor'
import { Button, Icon } from 'semantic-ui-react'
import { FragmentDataProperties } from './useFragmentConfig'

interface FragmentTesterProps {
  figTree: FigTreeEvaluator
  fragmentExpression: Fragment
  fragmentData?: FragmentDataProperties
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
  const [parameters, setParameters] = React.useState<Record<string, unknown>>(
    getUpdatedParameters({}, fragmentData)
  )
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    setParameters(getUpdatedParameters({}, fragmentData))
  }, [fragmentData])

  if (Object.keys(parameters).length === 0) return null

  const handleEvaluate = async (e: React.MouseEvent<Element, MouseEvent>) => {
    const fragmentName = fragmentData?.name ?? '?'
    const expression = { fragment: fragmentName, parameters }
    const fragments = { [fragmentName]: fragmentExpression }

    try {
      setLoading(true)
      const result = await figTree.evaluate(expression, { fragments })
      onEvaluate(result, e)
    } catch (err) {
      onError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-row-space-between" style={{ gap: '1em', maxWidth: 800 }}>
      <Button
        positive
        loading={loading}
        icon={<Icon name="play" size="large" />}
        content={'Test with Parameters'}
        onClick={handleEvaluate}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          maxHeight: '3.5em',
          flexShrink: 0,
          maxWidth: '150px',
        }}
      />
      <ReactJson
        data={parameters}
        setData={setParameters as (data: unknown) => void}
        rootName="parameters"
        rootFontSize={'1em'}
        theme={{
          container: {
            backgroundColor: 'transparent',
            paddingTop: 0,
            marginTop: '-0.5em',
            overflow: 'auto',
            flexShrink: 0,
            minWidth: '50%',
          },
        }}
        collapse={1}
        restrictEdit={({ level }) => level === 0}
      />
    </div>
  )
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
