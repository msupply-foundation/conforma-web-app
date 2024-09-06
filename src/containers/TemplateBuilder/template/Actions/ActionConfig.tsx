import React from 'react'
import { useEffect, useState } from 'react'
import { Icon, Label, Modal, Header } from 'semantic-ui-react'
import { TemplateAction } from '../../../../utils/generated/graphql'
import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import DropdownIO from '../../shared/DropdownIO'
import Evaluation from '../../shared/Evaluation'
import { useOperationState } from '../../shared/OperationContext'
import { Parameters, ParametersType } from '../../shared/Parameters'
import TextIO from '../../shared/TextIO'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'
import { useActionState } from './Actions'
import FromExistingAction from './FromExistingAction'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import { useToast } from '../../../../contexts/Toast'
import { EvaluatorNode } from 'fig-tree-evaluator'

type ActionConfigProps = {
  templateAction: TemplateAction | null
  onClose: () => void
}

type ActionUpdateState = {
  code?: string | null
  actionCode: string
  description: string | null
  eventCode?: string | null
  condition: EvaluatorNode
  parameterQueries: ParametersType
  id: number
}

type GetState = (action: TemplateAction) => ActionUpdateState

const getState: GetState = (action: TemplateAction) => ({
  code: action?.code,
  actionCode: action?.actionCode || '',
  description: action?.description || '',
  eventCode: action?.eventCode,
  condition: action?.condition || true,
  parameterQueries: action?.parameterQueries || {},
  id: action?.id || 0,
})

const ActionConfig: React.FC<ActionConfigProps> = ({ templateAction, onClose }) => {
  const { t } = useLanguageProvider()
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [state, setState] = useState<ActionUpdateState | null>(null)
  const { allActionsByCode, applicationData } = useActionState()
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const { showToast } = useToast({
    title: t('TEMPLATE_MESSAGE_SAVE_SUCCESS'),
    style: 'success',
  })

  const { canEdit } = template

  useEffect(() => {
    if (!templateAction) return setState(null)
    setState(getState(templateAction))
  }, [templateAction])

  if (!state || !templateAction) return null

  const updateAction = async () => {
    const result = await updateTemplate(template, {
      templateActionsUsingId: {
        updateById: [{ id: state.id, patch: state }],
      },
    })
    setShouldUpdate(false)
    showToast()
    if (!result) return
  }

  const saveAndClose = () => {
    updateAction()
    onClose()
  }

  const markNeedsUpdate = () => {
    setShouldUpdate(true)
  }

  const currentActionPlugin = allActionsByCode[String(templateAction?.actionCode)]

  return (
    <Modal className="config-modal" open={true}>
      <div className="config-modal-container ">
        <div className="config-modal-header">
          <div className="flex-column">
            <Header as="h3">Configure Action</Header>
            <p className="smaller-text">Trigger: {templateAction?.trigger || ''}</p>
          </div>
          <div className="flex-column">
            <DropdownIO
              title="Type"
              value={templateAction?.actionCode || ''}
              disabled={!canEdit}
              disabledMessage={disabledMessage}
              getKey={'code'}
              getValue={'code'}
              getText={'name'}
              setValue={(value) => {
                setState({ ...state, actionCode: String(value) })
                markNeedsUpdate()
              }}
              options={Object.values(allActionsByCode)}
              search
              labelNegative
              minLabelWidth={50}
            />
            {canEdit && (
              <FromExistingAction
                pluginCode={state.actionCode}
                setTemplateAction={(templateAction) => {
                  setState({ ...state, ...templateAction })
                  markNeedsUpdate()
                }}
              />
            )}
          </div>
        </div>
        <Label
          className="element-edit-info"
          attached="top right"
          style={{ borderTopRightRadius: 8 }}
        >
          <a
            href="https://github.com/msupply-foundation/conforma-server/wiki/List-of-Action-plugins"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="config-modal-info">
          {!canEdit && <Label color="red">Actions only editable in draft templates</Label>}
          <div className="spacer-10" />
          <div className="config-container-outline">
            <div className="flex-column-start-center">
              <TextIO
                text={state?.code || ''}
                title="Code"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setState({ ...state, code: text || null })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={state?.eventCode || ''}
                title="Scheduled Event Code"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setState({ ...state, eventCode: text || null })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={state?.description || ''}
                isTextArea={true}
                title="Description"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setState({ ...state, description: text || null })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={150}
                maxLabelWidth={150}
                textAreaDefaultRows={2}
                additionalStyles={{ minWidth: 500 }}
              />
              <Evaluation
                label="Condition"
                currentElementCode={''}
                evaluation={state?.condition}
                setEvaluation={(condition) => {
                  setState({ ...state, condition })
                  markNeedsUpdate()
                }}
                applicationData={applicationData}
                type="Action"
              />
            </div>
          </div>
          <div className="spacer-10" />
          <Parameters
            currentElementCode={''}
            parameters={state.parameterQueries}
            setParameters={(parameterQueries) => {
              setState({ ...state, parameterQueries })
              markNeedsUpdate()
            }}
            canEdit={template.canEdit}
            requiredParameters={(currentActionPlugin?.requiredParameters as string[]) || []}
            optionalParameters={(currentActionPlugin?.optionalParameters as string[]) || []}
            type="Action"
          />
          <div className="spacer-20" />
          <div className="flex-row-center-center">
            <ButtonWithFallback
              title={t('BUTTON_SAVE')}
              disabled={!canEdit || !shouldUpdate}
              disabledMessage={!canEdit ? disabledMessage : t('TEMPLATE_MESSAGE_SAVE_DISABLED')}
              onClick={updateAction}
            />
            <ButtonWithFallback
              title={t('BUTTON_CLOSE')}
              onClick={() => (shouldUpdate && canEdit ? setOpen(true) : onClose())}
            />
            <Modal
              basic
              size="small"
              icon="save"
              header={t('TEMPLATE_MESSAGE_SAVE_AND_CLOSE')}
              open={open}
              onClose={() => setOpen(false)}
              actions={[
                {
                  key: 'save',
                  content: t('BUTTON_SAVE'),
                  positive: true,
                  onClick: saveAndClose,
                },
                {
                  key: 'close',
                  content: t('BUTTON_CLOSE'),
                  positive: false,
                  onClick: onClose,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ActionConfig
