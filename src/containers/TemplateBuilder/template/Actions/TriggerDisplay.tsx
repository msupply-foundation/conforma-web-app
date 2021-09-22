import React, { useState } from 'react'
import { Button, Grid, Header, Popup } from 'semantic-ui-react'
import strings from '../../../../utils/constants'
import { TemplateAction, Trigger } from '../../../../utils/generated/graphql'
import CheckboxIO from '../../shared/CheckboxIO'
import { EvaluationHeader } from '../../shared/Evaluation'
import { IconButton } from '../../shared/IconButton'
import { useOperationState } from '../../shared/OperationContext'
import TextIO from '../../shared/TextIO'
import { useTemplateState, disabledMessage } from '../TemplateWrapper'
import ActionConfig from './ActionConfig'
import { useActionState } from './Actions'

type TemplateActions = { sequential: TemplateAction[]; asynchronous: TemplateAction[] }
type GetActionsForTrigger = (
  trigger: Trigger,
  allTemplateActions: TemplateAction[]
) => TemplateActions

enum ActionPosition {
  TOP,
  BOTTOM,
}

type IsAsynchronous = (templateAction: TemplateAction) => boolean

const isAsynchronous: IsAsynchronous = (templateAction) =>
  !templateAction.sequence || templateAction?.sequence <= 0

const getActionsForTrigger: GetActionsForTrigger = (trigger, allTemplateActions) => {
  const triggerActions = allTemplateActions.filter(
    (templateAction) => templateAction.trigger === trigger
  )
  return {
    asynchronous: triggerActions.filter(isAsynchronous),
    sequential: triggerActions
      .filter((templateAction) => !isAsynchronous(templateAction))
      .sort((a1, a2) => Number(a1.sequence) - Number(a2.sequence)),
  }
}

type TriggerDisplayProps = {
  trigger: Trigger
  allTemplateActions: TemplateAction[]
}

type SetIsSequential = (id: number, isSequential: boolean) => void
type SwapSequences = (fromAction: TemplateAction, toAction: TemplateAction) => void
type RemoveAction = (id: number) => void

const newAction = {
  actionCode: 'cLog',
  description: strings.TEMPLATE_LABEL_ACTION_DESCRIPTION,
  parameterQueries: {
    message: strings.TEMPLATE_LABEL_ACTION_MESSAGE,
  },
}

const TriggerDisplay: React.FC<TriggerDisplayProps> = ({ trigger, allTemplateActions }) => {
  const { updateTemplate } = useOperationState()
  const {
    template: { id: templateId, isDraft },
  } = useTemplateState()
  const { allActionsByCode } = useActionState()
  const { sequential, asynchronous } = getActionsForTrigger(trigger, allTemplateActions)
  const lastSequence = sequential.reduce(
    (max, current) =>
      max === 0 || max < Number(current?.sequence) ? Number(current?.sequence) : max,
    0
  )
  const firstSequence = sequential.reduce(
    (min, current) =>
      min === 0 || min > Number(current?.sequence) ? Number(current?.sequence) : min,
    0
  )

  const removeAction: RemoveAction = (id) => {
    updateTemplate(templateId, {
      templateActionsUsingId: { deleteById: [{ id }] },
    })
  }

  const addAction = (actionPosition: ActionPosition) => {
    let counter = 1
    if (actionPosition === ActionPosition.TOP)
      updateTemplate(templateId, {
        templateActionsUsingId: {
          updateById: sequential.map((action) => ({
            id: action.id,
            patch: { sequence: ++counter },
          })),
          create: [{ ...newAction, trigger, sequence: 1 }],
        },
      })
    else
      updateTemplate(templateId, {
        templateActionsUsingId: { create: [{ ...newAction, trigger, sequence: lastSequence + 1 }] },
      })
  }

  const setIsSequential: SetIsSequential = (id, isSequential) => {
    updateTemplate(templateId, {
      templateActionsUsingId: {
        updateById: [{ id, patch: { sequence: isSequential ? lastSequence + 1 : null } }],
      },
    })
  }

  const swapSequences: SwapSequences = (fromAction, toAction) => {
    updateTemplate(templateId, {
      templateActionsUsingId: {
        updateById: [
          { id: fromAction?.id, patch: { sequence: toAction?.sequence } },
          { id: toAction?.id, patch: { sequence: fromAction?.sequence } },
        ],
      },
    })
  }

  const renderTemplateActions = (title: string, templateActions: TemplateAction[]) => {
    const [currentTemplateAction, setCurrentTemplateAction] = useState<TemplateAction | null>(null)
    if (templateActions.length === 0) return null

    return (
      <div className="flex-column-start-start">
        <div className="spacer-10" />
        <div className="config-container">
          <Header as="h5" className="no-margin-no-padding">
            {title}
          </Header>
          {templateActions.map((templateAction, index) => (
            <div key={templateAction.id} className="config-container-alternate">
              <div className="flex-row-start-center">
                {!isAsynchronous(templateAction) && templateAction?.sequence !== firstSequence && (
                  <IconButton
                    name="angle up"
                    onClick={() => {
                      swapSequences(templateAction, templateActions[index - 1])
                    }}
                  />
                )}
                {!isAsynchronous(templateAction) && templateAction?.sequence !== lastSequence && (
                  <IconButton
                    name="angle down"
                    onClick={() => {
                      swapSequences(templateAction, templateActions[index + 1])
                    }}
                  />
                )}
                <IconButton
                  name="setting"
                  onClick={() => setCurrentTemplateAction(templateAction)}
                />
                <div className="flex-row-start-center-wrap">
                  <TextIO
                    title={strings.TEMPLATE_LABEL_ACTION}
                    text={allActionsByCode[String(templateAction?.actionCode)]?.name || ''}
                  />
                  <TextIO
                    title={strings.TEMPLATE_LABEL_DESCRIPTION}
                    text={templateAction?.description || ''}
                    isTextArea={true}
                  />
                  <div className="config-container">
                    <div className="flex-row-start-center">
                      <Header
                        as="h6"
                        className="no-margin-no-padding"
                        content={strings.TEMPLATE_LABEL_CONDITION}
                      />
                      <EvaluationHeader evaluation={templateAction?.condition} />
                    </div>
                  </div>
                </div>
                <CheckboxIO
                  disabled={!isDraft}
                  disabledMessage={disabledMessage}
                  title={strings.TEMPLATE_LABEL_SEQUENTIAL}
                  value={!isAsynchronous(templateAction)}
                  setValue={(isSequential) =>
                    setIsSequential(templateAction?.id || 0, isSequential)
                  }
                />
                <IconButton
                  disabled={!isDraft}
                  disabledMessage={disabledMessage}
                  name="window close"
                  onClick={() => removeAction(templateAction?.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <ActionConfig
          templateAction={currentTemplateAction}
          onClose={() => setCurrentTemplateAction(null)}
        />
      </div>
    )
  }

  return (
    <div className="flex-column-start-start">
      <div className="spacer-20" />
      <div className="flex-row-start-center">
        <Header as="h4" className="no-margin-no-padding">
          {trigger}
        </Header>
        {/* <IconButton title="add new action" name="add square" onClick={addAction} /> */}
        <Popup
          flowing
          hoverable
          trigger={<Button content={strings.TEMPLATE_BUTTON_ACTION_ADD} icon="add square" />}
          position="right center"
        >
          <Grid divided columns={2}>
            <Grid.Column textAlign="center">
              <IconButton
                title="top"
                name="sort up"
                onClick={() => addAction(ActionPosition.TOP)}
              />
            </Grid.Column>
            <Grid.Column textAlign="center">
              <IconButton
                title="bottom"
                name="sort down"
                onClick={() => addAction(ActionPosition.BOTTOM)}
              />
            </Grid.Column>
          </Grid>
        </Popup>
      </div>
      {renderTemplateActions('Sequential', sequential)}
      {renderTemplateActions('Asynchronous', asynchronous)}
    </div>
  )
}

export default TriggerDisplay
