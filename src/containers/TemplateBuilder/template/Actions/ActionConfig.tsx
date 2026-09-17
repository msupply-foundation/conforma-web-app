import React, { useState } from 'react'
import { Icon, Label, Modal, Header } from 'semantic-ui-react'
import { TemplateAction } from '../../../../utils/generated/graphql'
import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import DropdownIO from '../../shared/DropdownIO'
import Evaluation from '../../shared/Evaluation'
import { useOperationState } from '../../shared/OperationContext'
import { Parameters } from '../../shared/Parameters'
import TextIO from '../../shared/TextIO'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'
import { useActionState } from './Actions'
import FromExistingAction from './FromExistingAction'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import { useToast } from '../../../../contexts/Toast'
import { useUndo } from '@json-edit-react/utils'
import { UndoRedo } from '../../../../components/common/UndoRedo'
import { FigTreeActions } from './FigTreeActions'
import { useInitialiseMultipleExpressions } from '../../shared/useInitialiseMultipleExpressions'
import { EvaluatorNode } from 'fig-tree-editor-react'

type ActionConfigProps = {
  templateAction: TemplateAction
  onClose: () => void
}

const getState = (action: TemplateAction) => ({
  code: action?.code,
  actionCode: action?.actionCode || '',
  description: action?.description || '',
  eventCode: action?.eventCode,
  condition: action?.condition || true,
  // parameterQueries: action?.parameterQueries || {},
  id: action?.id || 0,
})

const ActionConfig: React.FC<ActionConfigProps> = ({ templateAction, onClose }) => {
  const { t } = useLanguageProvider()
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const { allActionsByCode, applicationData } = useActionState()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const { showToast } = useToast({
    title: t('TEMPLATE_MESSAGE_SAVE_SUCCESS'),
    style: 'success',
  })

  const { canEdit } = template

  // Action data is divided into two "blocks" for "undo" groupings
  const [mainData, setMainDataState] = useState(getState(templateAction))
  const {
    set: setMainData,
    replace: replaceMain,
    reset: resetMain,
    undo: undoMain,
    redo: redoMain,
    canUndo: canUndoMain,
    canRedo: canRedoMain,
  } = useUndo(mainData, setMainDataState)

  const [parameters, setParametersState] = useState(templateAction?.parameterQueries || {})
  const {
    set: setParameters,
    replace: replaceParameters,
    reset: resetParameters,
    undo: undoParameters,
    redo: redoParameters,
    canUndo: canUndoParameters,
    canRedo: canRedoParameters,
  } = useUndo(parameters, setParametersState)

  const { updateExpression: setMainDataItem } = useInitialiseMultipleExpressions(
    mainData,
    setMainData as (data: Record<string, EvaluatorNode>) => void,
    true,
    resetMain as (data: EvaluatorNode, key?: string) => void,
    replaceMain as (data: Record<string, EvaluatorNode>) => void,
    setIsDirty
  )

  const updateAction = async () => {
    const patch = { ...mainData, parameterQueries: parameters }
    const result = await updateTemplate(template, {
      templateActionsUsingId: {
        updateById: [{ id: mainData.id, patch }],
      },
    })
    setIsDirty(false)
    showToast()
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
                resetMain({ ...mainData, actionCode: String(value) })
                setIsDirty(true)
              }}
              options={Object.values(allActionsByCode)}
              search
              labelNegative
              minLabelWidth={50}
            />
            {canEdit && (
              <FromExistingAction
                pluginCode={mainData.actionCode}
                setTemplateAction={(templateAction) => {
                  const { condition, description, parameterQueries } = templateAction
                  resetMain({ ...mainData, condition, description })
                  resetParameters(parameterQueries)
                  setIsDirty(true)
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
                text={mainData?.code || ''}
                title="Code"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setMainData({ ...mainData, code: text || null })
                }}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={mainData?.eventCode || ''}
                title="Scheduled Event Code"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setMainData({ ...mainData, eventCode: text || null })
                }}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={150}
              />
              <TextIO
                text={mainData?.description || ''}
                isTextArea={true}
                title="Description"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setMainData({ ...mainData, description: text ?? '' })
                }}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={150}
                maxLabelWidth={150}
                textAreaDefaultRows={2}
                additionalStyles={{ minWidth: 500 }}
              />
              <Evaluation
                figTree={FigTreeActions}
                label="Condition"
                evaluation={mainData?.condition}
                setEvaluation={(condition) => setMainDataItem('condition', condition)}
                canEdit={canEdit}
                objectData={{ applicationData }}
                resetExpression={(expression) => {
                  resetMain({ ...mainData, condition: expression })
                }}
              />
              <div className="spacer-10" />
              <UndoRedo
                canUndo={canUndoMain}
                canRedo={canRedoMain}
                undo={undoMain}
                redo={redoMain}
              />
            </div>
          </div>
          <div className="spacer-10" />
          <Parameters
            figTree={FigTreeActions}
            key="parametersAction"
            currentElementCode={''}
            parameters={parameters}
            setParameters={(parameterQueries) => setParameters(parameterQueries)}
            replace={replaceParameters}
            reset={(expression, key) => {
              if (key) {
                const newParameters = { ...parameters }
                delete newParameters[key]
                resetParameters({ ...parameters, [key]: expression })
              } else {
                resetParameters(expression)
              }
            }}
            setIsDirty={setIsDirty}
            canEdit={template.canEdit}
            requiredParameters={(currentActionPlugin?.requiredParameters as string[]) || []}
            optionalParameters={(currentActionPlugin?.optionalParameters as string[]) || []}
            type="Action"
            UndoRedo={
              <UndoRedo
                canUndo={canUndoParameters}
                canRedo={canRedoParameters}
                undo={undoParameters}
                redo={redoParameters}
              />
            }
          />
          <div className="spacer-20" />
          <div className="flex-row-center-center">
            <ButtonWithFallback
              title={t('BUTTON_SAVE')}
              disabled={!canEdit || !isDirty}
              disabledMessage={!canEdit ? disabledMessage : t('TEMPLATE_MESSAGE_SAVE_DISABLED')}
              onClick={updateAction}
            />
            <ButtonWithFallback
              title={t('BUTTON_CLOSE')}
              onClick={() => (isDirty && canEdit ? setOpen(true) : onClose())}
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
