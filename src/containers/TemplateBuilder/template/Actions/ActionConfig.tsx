import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
import React from 'react'
import { useEffect, useState } from 'react'
import { Icon, Label, Modal } from 'semantic-ui-react'
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

type ActionConfigProps = {
  templateAction: TemplateAction | null
  onClose: () => void
}

type ActionUpdateState = {
  actionCode: string
  description: string
  eventCode: string
  condition: EvaluatorNode
  parameterQueries: ParametersType
  id: number
}

type GetState = (action: TemplateAction) => ActionUpdateState

const getState: GetState = (action: TemplateAction) => ({
  actionCode: action?.actionCode || '',
  description: action?.description || '',
  eventCode: action?.eventCode || '',
  condition: action?.condition || true,
  parameterQueries: action?.parameterQueries || {},
  id: action?.id || 0,
})

const ActionConfig: React.FC<ActionConfigProps> = ({ templateAction, onClose }) => {
  const {
    template: { id: templateId, isDraft },
  } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [state, setState] = useState<ActionUpdateState | null>(null)
  const { allActionsByCode, applicationData } = useActionState()
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

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
    if (!result) return
  }

  const saveAndClose = () => {
    updateAction()
    onClose()
  }

  const currentActionPlugin = allActionsByCode[String(templateAction?.actionCode)]

  return (
    <Modal className="config-modal" open={true}>
      <div className="config-modal-container ">
        {!isDraft && <Label color="red">Actions only editable in draft templates</Label>}
        <Label className="element-edit-info" attached="top right">
          <a
            href="https://github.com/openmsupply/application-manager-server/wiki/List-of-Action-plugins"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="flex-row-center-center-wrap">
          <DropdownIO
            title="Type"
            value={templateAction?.actionCode || ''}
            getKey={'code'}
            getValue={'code'}
            getText={'name'}
            setValue={(value) => {
              setState({ ...state, actionCode: String(value) })
              setShouldUpdate(true)
            }}
            options={Object.values(allActionsByCode)}
          />

          <FromExistingAction
            pluginCode={state.actionCode}
            setTemplateAction={(templateAction) => {
              setState({ ...state, ...templateAction })
              setShouldUpdate(true)
            }}
          />
          <TextIO
            text={state.eventCode}
            title="Scheduled Event Code"
            setText={(text) => {
              setState({ ...state, eventCode: text })
              setShouldUpdate(true)
            }}
            isPropUpdated={true}
          />
          <TextIO text={templateAction?.trigger || ''} title="Trigger" />
          <div className="long">
            <TextIO
              text={state.description}
              isTextArea={true}
              title="Description"
              setText={(text) => {
                setState({ ...state, description: text })
                setShouldUpdate(true)
              }}
              isPropUpdated={true}
            />
          </div>
        </div>
        <div className="config-container-alternate">
          <Evaluation
            label="Condition"
            currentElementCode={''}
            evaluation={state?.condition}
            setEvaluation={(condition) => {
              setState({ ...state, condition })
              setShouldUpdate(true)
            }}
            applicationData={applicationData}
          />
        </div>
        <div className="flex-row-center-center">
          <TextIO
            title="Required Parameters"
            text={JSON.stringify(currentActionPlugin?.requiredParameters || [])}
          />
          <TextIO
            title="Optional Parameters"
            text={JSON.stringify(currentActionPlugin?.optionalParameters || [])}
          />
        </div>
        <Parameters
          currentElementCode={''}
          parameters={state.parameterQueries}
          setParameters={(parameterQueries) => {
            setState({ ...state, parameterQueries })
            setShouldUpdate(true)
          }}
        />
        <div className="spacer-20" />
        <div className="flex-row-center-center">
          <ButtonWithFallback
            title="Save"
            disabled={!isDraft}
            disabledMessage={disabledMessage}
            onClick={updateAction}
          />
          <ButtonWithFallback
            title="Close"
            onClick={() => (shouldUpdate ? setOpen(true) : onClose())}
          />
          <Modal
            basic
            size="small"
            icon="save"
            header="There are changes not saved. Would you like to save and close?"
            open={open}
            onClose={() => setOpen(false)}
            actions={[
              { key: 'save', content: 'Save', positive: true, onClick: saveAndClose },
              { key: 'close', content: 'Close', positive: false, onClick: onClose },
            ]}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ActionConfig
