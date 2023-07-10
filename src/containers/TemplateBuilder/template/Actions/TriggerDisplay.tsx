import React, { useState } from 'react'
import { Checkbox, Header, Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../../contexts/Localisation'
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

const TriggerDisplay: React.FC<TriggerDisplayProps> = ({ trigger, allTemplateActions }) => {
  const { t } = useLanguageProvider()
  const { updateTemplate } = useOperationState()
  const { template } = useTemplateState()
  const { allActionsByCode } = useActionState()
  const [addActionAtBottom, setAddActionAtBottom] = useState(true)
  const { sequential, asynchronous } = getActionsForTrigger(trigger, allTemplateActions)

  const { canEdit } = template

  const newAction = {
    actionCode: 'cLog',
    description: t('TEMPLATE_LABEL_ACTION_DESCRIPTION'),
    parameterQueries: {
      message: t('TEMPLATE_LABEL_ACTION_MESSAGE'),
    },
  }

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
    updateTemplate(template, {
      templateActionsUsingId: { deleteById: [{ id }] },
    })
  }

  const addAction = () => {
    let counter = 1
    if (addActionAtBottom)
      updateTemplate(template, {
        templateActionsUsingId: { create: [{ ...newAction, trigger, sequence: lastSequence + 1 }] },
      })
    else
      updateTemplate(template, {
        templateActionsUsingId: {
          updateById: sequential.map((action) => ({
            id: action.id,
            patch: { sequence: ++counter },
          })),
          create: [{ ...newAction, trigger, sequence: 1 }],
        },
      })
  }

  const setIsSequential: SetIsSequential = (id, isSequential) => {
    updateTemplate(template, {
      templateActionsUsingId: {
        updateById: [{ id, patch: { sequence: isSequential ? lastSequence + 1 : null } }],
      },
    })
  }

  const swapSequences: SwapSequences = (fromAction, toAction) => {
    updateTemplate(template, {
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
      <div className="flex-column-start-stretch">
        <div className="spacer-10" />
        <div className="config-container-alternate">
          <Header as="h5" className="no-margin-no-padding">
            {title}
          </Header>
          {templateActions.map((templateAction, index) => (
            <div key={templateAction.id} className="config-container">
              <div className="flex-row-start-center">
                {!isAsynchronous(templateAction) && canEdit && (
                  <IconButton
                    name="angle up"
                    onClick={() => {
                      swapSequences(templateAction, templateActions[index - 1])
                    }}
                    hidden={templateAction?.sequence === firstSequence}
                  />
                )}
                {!isAsynchronous(templateAction) && canEdit && (
                  <IconButton
                    name="angle down"
                    onClick={() => {
                      swapSequences(templateAction, templateActions[index + 1])
                    }}
                    hidden={templateAction?.sequence === lastSequence}
                  />
                )}
                <IconButton
                  name="setting"
                  onClick={() => setCurrentTemplateAction(templateAction)}
                />
                <div className="flex-row-space-between" style={{ width: '100%' }}>
                  <div className="flex-row-start-center-wrap">
                    <TextIO
                      title={t('TEMPLATE_LABEL_ACTION')}
                      text={allActionsByCode[String(templateAction?.actionCode)]?.name || ''}
                      minLabelWidth={90}
                      labelTextAlign="right"
                    />
                    <TextIO
                      title={t('TEMPLATE_LABEL_DESCRIPTION')}
                      text={templateAction?.description || ''}
                      isTextArea={true}
                      minLabelWidth={90}
                      labelTextAlign="right"
                    />
                    <div className="config-container-outline">
                      <div className="flex-row-start-center">
                        <Header
                          as="h6"
                          className="no-margin-no-padding right-margin-space-10"
                          content={t('TEMPLATE_LABEL_CONDITION')}
                        />
                        <EvaluationHeader evaluation={templateAction?.condition} />
                      </div>
                    </div>
                  </div>
                  <div className="flex-row">
                    <div style={{ alignSelf: 'flex-end' }}>
                      <CheckboxIO
                        disabled={!canEdit}
                        disabledMessage={disabledMessage}
                        title={t('TEMPLATE_LABEL_SEQUENTIAL')}
                        value={!isAsynchronous(templateAction)}
                        setValue={(isSequential) =>
                          setIsSequential(templateAction?.id || 0, isSequential)
                        }
                      />
                    </div>
                    <div style={{ alignSelf: 'flex-start' }}>
                      <IconButton
                        disabled={!canEdit}
                        disabledMessage={disabledMessage}
                        name="window close"
                        onClick={() => removeAction(templateAction?.id)}
                      />
                    </div>
                  </div>
                </div>
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
    <>
      <div className="spacer-20" />
      <div className="config-container-outline">
        <div className="flex-row-start-center flex-gap-20">
          <Header as="h4" className="no-margin-no-padding">
            {trigger}
          </Header>
          {canEdit && (
            <>
              <Button primary inverted onClick={addAction}>
                {t('TEMPLATE_BUTTON_ADD_ACTION')}
              </Button>
              <Checkbox
                toggle
                label={t('TEMPLATE_LABEL_ACTION_ON_TOP')}
                onChange={() => setAddActionAtBottom(!addActionAtBottom)}
                checked={!addActionAtBottom}
              />
            </>
          )}
        </div>
        {renderTemplateActions('Sequential', sequential)}
        {renderTemplateActions('Asynchronous', asynchronous)}
      </div>
    </>
  )
}

export default TriggerDisplay
