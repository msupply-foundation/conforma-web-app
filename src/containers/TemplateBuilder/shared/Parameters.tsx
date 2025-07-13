import React, { useState } from 'react'
import { Accordion, Button, Header, Icon } from 'semantic-ui-react'
import { FullStructure } from '../../../utils/types'
import { useActionState } from '../template/Actions/Actions'
import CheckboxIO from './CheckboxIO'
import TextIO from '../shared/TextIO'
import Evaluation, { ObjectDataDisplay } from './Evaluation'
import { EvaluatorNode } from 'fig-tree-evaluator'
import { EvaluationEditor } from '../../../components/common/EvaluationEditor'
import { useUserState } from '../../../contexts/UserState'
import { FigTreeEvaluator } from 'fig-tree-editor-react'

export type ParametersType = {
  [key: string]: EvaluatorNode
}

type ParametersProps = {
  parameters: ParametersType
  currentElementCode: string
  setParameters: (parameters: ParametersType) => void
  reset: (expression: EvaluatorNode, key?: string) => void
  canEdit: boolean
  fullStructure?: FullStructure
  requiredParameters?: string[]
  optionalParameters?: string[]
  type?: 'FormElement' | 'Action'
  UndoRedo: JSX.Element
  figTree: FigTreeEvaluator
}

export const Parameters: React.FC<ParametersProps> = ({
  parameters,
  setParameters,
  canEdit,
  currentElementCode,
  fullStructure,
  requiredParameters,
  optionalParameters,
  type,
  UndoRedo,
  reset,
  figTree,
}) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const { applicationData } = useActionState()
  const [showCombined, setShowCombined] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const objectData =
    type === 'Action'
      ? { applicationData }
      : type === 'FormElement'
      ? {
          responses: {
            ...fullStructure?.responsesByCode,
            thisResponse: fullStructure?.responsesByCode?.[currentElementCode]?.text,
          },
          currentUser,
          applicationData: { ...fullStructure?.info, currentPageType: 'application' },
        }
      : {}

  return (
    <Accordion
      className="evaluation-container config-container-alternate"
      style={{ minWidth: 450 }}
    >
      <Accordion.Title
        className="evaluation-container-title no-margin-no-padding"
        active={isActive}
        onClick={() => setIsActive(!isActive)}
      >
        <Header
          as="h4"
          content={`Plugin Specific Parameters (${Object.keys(parameters).length})`}
        />
        <div className="flex-row-end">
          <Icon size="large" name={isActive ? 'angle up' : 'angle down'} />
        </div>
      </Accordion.Title>
      {isActive && (
        <Accordion.Content className="evaluation-container-content" active={isActive}>
          <>
            <div className="flex-column-start-stretch">
              {(requiredParameters || optionalParameters) && (
                <div className="flex-row-start-center-wrap" style={{ maxWidth: 600 }}>
                  <TextIO
                    title="Required Parameters"
                    text={
                      requiredParameters && requiredParameters.length > 0
                        ? JSON.stringify(requiredParameters, null, 2)
                        : '<none>'
                    }
                    labelNegative
                  />
                  <TextIO
                    title="Optional Parameters"
                    isTextArea={true}
                    text={
                      optionalParameters && optionalParameters.length > 0
                        ? JSON.stringify(optionalParameters, null, 2)
                        : '<none>'
                    }
                    labelNegative
                  />
                </div>
              )}
              <div className="config-container-outline">
                <div className="flex-row flex-gap-20">
                  <CheckboxIO
                    title="Show combined parameters"
                    value={showCombined}
                    setValue={setShowCombined}
                  />
                  <div className="spacer-10" />
                  {!showCombined && (
                    <Button
                      primary
                      inverted
                      disabled={!canEdit}
                      onClick={() => {
                        setParameters({ ...parameters, newParameter: null })
                      }}
                    >
                      Add Parameter
                    </Button>
                  )}
                </div>
                {!showCombined &&
                  Object.entries(parameters).map(([key, value]) => (
                    <Evaluation
                      figTree={figTree}
                      setEvaluation={(value: any) => setParameters({ ...parameters, [key]: value })}
                      updateKey={(newKey) => {
                        // Convert to array to preserve property order
                        const newParameters = Object.entries(parameters)
                        const thisParameter = newParameters.find(([k]) => k === key)
                        if (thisParameter) thisParameter[0] = newKey
                        setParameters(Object.fromEntries(newParameters))
                      }}
                      deleteKey={
                        canEdit
                          ? () => {
                              const newParameters = { ...parameters }
                              delete newParameters[key]
                              setParameters(newParameters)
                            }
                          : undefined
                      }
                      key={key}
                      evaluation={value}
                      label={key}
                      canEdit={canEdit}
                      objectData={objectData}
                      resetExpression={(expression) => reset(expression, key)}
                    />
                  ))}
                {showCombined && (
                  <div className="flex-row-space-between" style={{ gap: '1em' }}>
                    <EvaluationEditor
                      figTree={figTree}
                      expression={parameters}
                      setExpression={setParameters as (d: EvaluatorNode) => void}
                      resetExpression={reset}
                      canEdit={canEdit}
                      collapse={1}
                      objectData={objectData}
                      isCombinedView
                    />
                    <ObjectDataDisplay objectData={objectData} />
                  </div>
                )}
              </div>
              <div className="spacer-10" />
              {UndoRedo}
            </div>
          </>
        </Accordion.Content>
      )}
    </Accordion>
  )
}
