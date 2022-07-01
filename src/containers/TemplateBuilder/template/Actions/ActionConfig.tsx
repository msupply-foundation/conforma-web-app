import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
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

type ActionConfigProps = {
  templateAction: TemplateAction | null
  onClose: () => void
}

type ActionUpdateState = {
  code: string
  actionCode: string
  description: string
  eventCode: string
  condition: EvaluatorNode
  parameterQueries: ParametersType
  id: number
}

type GetState = (action: TemplateAction) => ActionUpdateState

const getState: GetState = (action: TemplateAction) => ({
  code: action?.code || '',
  actionCode: action?.actionCode || '',
  description: action?.description || '',
  eventCode: action?.eventCode || '',
  condition: action?.condition || true,
  parameterQueries: action?.parameterQueries || {},
  id: action?.id || 0,
})

const ActionConfig: React.FC<ActionConfigProps> = ({ templateAction, onClose }) => {
  const { strings } = useLanguageProvider()
  const {
    template: { id: templateId, isDraft },
  } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [state, setState] = useState<ActionUpdateState | null>(null)
  const { allActionsByCode, applicationData } = useActionState()
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const showToast = useToast({
    title: strings.TEMPLATE_MESSAGE_SAVE_SUCCESS,
    style: 'success',
  })

  useEffect(() => {
    if (!templateAction) return setState(null)
    setState(getState(templateAction))
  }, [templateAction])

  if (!state || !templateAction) return null

  const updateAction = async () => {
    const result = await updateTemplate(templateId, {
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
              getKey={'code'}
              getValue={'code'}
              getText={'name'}
              setValue={(value) => {
                setState({ ...state, actionCode: String(value) })
                markNeedsUpdate()
              }}
              options={Object.values(allActionsByCode)}
              labelNegative
              minLabelWidth={50}
            />
            <FromExistingAction
              pluginCode={state.actionCode}
              setTemplateAction={(templateAction) => {
                setState({ ...state, ...templateAction })
                markNeedsUpdate()
              }}
            />
          </div>
        </div>
        <Label
          className="element-edit-info"
          attached="top right"
          style={{ borderTopRightRadius: 8 }}
        >
          <a
            href="https://github.com/openmsupply/conforma-server/wiki/List-of-Action-plugins"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="config-modal-info">
          {!isDraft && <Label color="red">Actions only editable in draft templates</Label>}
          <div className="spacer-10" />
          <div className="config-container-outline">
            <div className="flex-column-start-center">
              <TextIO
                text={state.code}
                title="Code"
                setText={(text) => {
                  setState({ ...state, code: text })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={state.eventCode}
                title="Scheduled Event Code"
                setText={(text) => {
                  setState({ ...state, eventCode: text })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={state.description}
                isTextArea={true}
                title="Description"
                setText={(text) => {
                  setState({ ...state, description: text })
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
            requiredParameters={(currentActionPlugin?.requiredParameters as string[]) || []}
            optionalParameters={(currentActionPlugin?.optionalParameters as string[]) || []}
            type="Action"
          />
          <div className="spacer-20" />
          <div className="flex-row-center-center">
            <ButtonWithFallback
              title={strings.BUTTON_SAVE}
              disabled={!isDraft || !shouldUpdate}
              disabledMessage={!isDraft ? disabledMessage : strings.TEMPLATE_MESSAGE_SAVE_DISABLED}
              onClick={updateAction}
            />
            <ButtonWithFallback
              title={strings.BUTTON_CLOSE}
              onClick={() => (shouldUpdate ? setOpen(true) : onClose())}
            />
            <Modal
              basic
              size="small"
              icon="save"
              header={strings.TEMPLATE_MESSAGE_SAVE_AND_CLOSE}
              open={open}
              onClose={() => setOpen(false)}
              actions={[
                {
                  key: 'save',
                  content: strings.BUTTON_SAVE,
                  positive: true,
                  onClick: saveAndClose,
                },
                {
                  key: 'close',
                  content: strings.BUTTON_CLOSE,
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
