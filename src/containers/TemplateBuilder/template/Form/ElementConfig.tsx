import React, { useState } from 'react'
import { Modal, Label, Icon, Header } from 'semantic-ui-react'
import { PluginProvider } from '../../../../formElementPlugins/pluginProvider'
import {
  Reviewability,
  TemplateElement,
  TemplateElementCategory,
} from '../../../../utils/generated/graphql'
import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import DropdownIO from '../../shared/DropdownIO'
import Evaluation from '../../shared/Evaluation'
import { useOperationState } from '../../shared/OperationContext'
import { ParametersType, Parameters } from '../../shared/Parameters'
import TextIO from '../../shared/TextIO'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'
import { useFullApplicationState } from '../ApplicationWrapper'
import { useFormState } from './Form'
import FromExistingElement from './FromExistingElement'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import useConfirmationModal from '../../../../utils/hooks/useConfirmationModal'
import { EvaluatorNode } from 'fig-tree-evaluator'
import { useUserState } from '../../../../contexts/UserState'
import { useUndo } from '@json-edit-react/utils'
import { UndoRedo } from '../../../../components/common/UndoRedo'
import { FigTree } from '../../../../FigTreeEvaluator'
import { useInitialiseMultipleExpressions } from '../../shared/useInitialiseMultipleExpressions'
import { Position, useToast } from '../../../../contexts/Toast'

type ElementConfigProps = {
  element: TemplateElement
  onClose: () => void
  isReviewerSectionElement: boolean
}

type ElementUpdateState = {
  code: string
  title: string | null
  category: TemplateElementCategory
  elementTypePluginCode: string
  visibilityCondition: EvaluatorNode
  isRequired: EvaluatorNode
  isEditable: EvaluatorNode
  validation: EvaluatorNode
  validationMessage: string | null
  helpText: string | null
  parameters: ParametersType
  initialValue: EvaluatorNode
  reviewability: Reviewability | null
  id: number
}

const getState = (
  element: Partial<TemplateElement>,
  block: 'main' | 'commonProperties' | 'parameters'
) => {
  switch (block) {
    case 'main':
      return {
        id: element.id,
        code: element.code || '',
        title: element.title || null,
        category: element.category || TemplateElementCategory.Information,
        elementTypePluginCode: element.elementTypePluginCode || '',
        helpText: element.helpText || null,
        validationMessage: element.validationMessage || '',
        reviewability: element.reviewability || null,
      }
    case 'commonProperties':
      return {
        visibilityCondition: element.visibilityCondition,
        isRequired: element.isRequired,
        isEditable: element.isEditable,
        validation: element.validation,
        initialValue: element.initialValue || null,
      }
    case 'parameters':
      return element.parameters || {}
  }
}

type Evaluations = {
  key: keyof ElementUpdateState
  title: string
}[]

const evaluations: Evaluations = [
  { key: 'isEditable', title: 'Is Editable' },
  { key: 'isRequired', title: 'Is Required' },
  { key: 'validation', title: 'Is Valid' },
  { key: 'visibilityCondition', title: 'Is Visible' },
  { key: 'initialValue', title: 'Initial Value' },
]

const ElementConfig: React.FC<ElementConfigProps> = ({
  element,
  isReviewerSectionElement,
  onClose,
}) => {
  const { t } = useLanguageProvider()
  const { ConfirmModal: RemoveElementModal, showModal: showRemoveElementModal } =
    useConfirmationModal({
      title: t('TEMPLATE_MESSAGE_REMOVE_ELEMENT_TITLE'),
      message: t('TEMPLATE_MESSAGE_REMOVE_ELEMENT_CONTENT'),
      confirmText: t('BUTTON_CONFIRM'),
    })

  const { structure, reloadApplication } = useFullApplicationState()
  const {
    template: { canEdit },
  } = useTemplateState()
  const { selectedSectionId } = useFormState()
  const { updateApplication, updateTemplateSection } = useOperationState()
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const {
    userState: { currentUser },
  } = useUserState()

  const { showToast } = useToast({ position: Position.topLeft })

  // Element data is divided into three "blocks" for "undo" groupings
  const [mainData, setMainDataState] = useState(getState(element, 'main'))
  const {
    set: setMainData,
    reset: resetMain,
    undo: undoMain,
    redo: redoMain,
    canUndo: canUndoMain,
    canRedo: canRedoMain,
  } = useUndo(mainData, setMainDataState)

  const [commonData, setCommonDataState] = useState(getState(element, 'commonProperties'))
  const {
    set: setCommonData,
    reset: resetCommon,
    undo: undoCommon,
    redo: redoCommon,
    canUndo: canUndoCommon,
    canRedo: canRedoCommon,
  } = useUndo(commonData, setCommonDataState)

  const [parameters, setParametersState] = useState(getState(element, 'parameters'))
  const {
    set: setParameters,
    reset: resetParameters,
    undo: undoParameters,
    redo: redoParameters,
    canUndo: canUndoParameters,
    canRedo: canRedoParameters,
  } = useUndo(parameters, setParametersState)

  const removeElement = async () => {
    const applicationResponseId =
      structure?.elementsById?.[mainData.id]?.latestApplicationResponse?.id || null

    if (applicationResponseId) {
      const result = await updateApplication(structure.info.serial, {
        applicationResponsesUsingId: {
          deleteById: [{ id: applicationResponseId }],
        },
      })
      if (!result) return
    }

    const result = await updateTemplateSection(selectedSectionId, {
      templateElementsUsingId: {
        deleteById: [{ id: mainData.id }],
      },
    })
    reloadApplication()
    if (!result) return

    onClose()
  }

  const { updateExpression: setCommonDataItem } = useInitialiseMultipleExpressions(
    commonData,
    setCommonData,
    true,
    resetCommon,
    setIsDirty
  )

  const updateElement = async () => {
    const patch = { ...mainData, ...commonData, parameters }
    const result = await updateTemplateSection(selectedSectionId, {
      templateElementsUsingId: {
        updateById: [{ id: mainData.id, patch }],
      },
    })
    setIsDirty(false)
    showToast({ title: t('TEMPLATE_MESSAGE_SAVE_SUCCESS'), style: 'success' })
    if (!result) return
  }

  const saveAndClose = () => {
    updateElement()
    onClose()
  }

  return (
    <Modal className="config-modal" open={true}>
      <div className="config-modal-container">
        <div className="config-modal-header">
          <Header as="h3">{mainData.title}</Header>
          <div className="flex-column">
            <DropdownIO
              title="Type"
              value={mainData.elementTypePluginCode}
              disabled={!canEdit}
              disabledMessage={disabledMessage}
              getKey={'code'}
              getValue={'code'}
              getText={'displayName'}
              setValue={(value) => {
                resetMain({ ...mainData, elementTypePluginCode: String(value) })
                setIsDirty(true)
              }}
              options={Object.values(PluginProvider).map((element) => element.config)}
              search
              labelNegative
              minLabelWidth={50}
              isPropUpdated={true}
            />
            {canEdit && (
              <FromExistingElement
                pluginCode={mainData.elementTypePluginCode}
                setTemplateElement={(existingElement) => {
                  const { category, helpText, validationMessage } = existingElement
                  const newMainData = { ...mainData, category, helpText, validationMessage }
                  const newCommonData = getState(existingElement, 'commonProperties')
                  const newParameters = getState(existingElement, 'parameters')
                  resetMain({ ...mainData, ...newMainData })
                  resetCommon(newCommonData)
                  resetParameters(newParameters)
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
            href="https://github.com/msupply-foundation/conforma-web-app/wiki/Element-Type-Specs"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="config-modal-info">
          {!canEdit && <Label color="red">Template form only editable on draft templates</Label>}
          <div className="spacer-10" />
          <div className="config-container-outline" style={{ maxWidth: 600 }}>
            <div className="flex-row-start-start">
              <div className="full-width-container">
                <TextIO
                  text={mainData?.title || ''}
                  title="Title"
                  setText={(text) => {
                    setMainData({ ...mainData, title: text })
                  }}
                  disabled={!canEdit}
                  disabledMessage={disabledMessage}
                  markNeedsUpdate={() => setIsDirty(true)}
                  isPropUpdated={true}
                  minLabelWidth={60}
                  maxLabelWidth={60}
                />
              </div>
            </div>
            <div className="flex-row-start-start">
              <TextIO
                text={mainData.code}
                title="Code"
                setText={(text) => {
                  setMainData({ ...mainData, code: text ?? '' })
                }}
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={60}
                maxLabelWidth={60}
              />
              <DropdownIO
                title="Category"
                value={mainData.category}
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                getKey={'category'}
                getValue={'category'}
                getText={'title'}
                isPropUpdated={true}
                setValue={(value) => {
                  setMainData({ ...mainData, category: value as TemplateElementCategory })
                  setIsDirty(true)
                }}
                options={[
                  { category: TemplateElementCategory.Information, title: 'Information' },
                  { category: TemplateElementCategory.Question, title: 'Question' },
                ]}
              />
            </div>
            {!isReviewerSectionElement && (
              <div className="full-width-container">
                <DropdownIO
                  title="Is Reviewable"
                  value={mainData.reviewability || 'default'}
                  disabled={!canEdit}
                  disabledMessage={disabledMessage}
                  getKey={'value'}
                  getValue={'value'}
                  getText={'text'}
                  isPropUpdated={true}
                  setValue={(value) => {
                    const updateValue = value === 'default' ? null : value
                    setMainData({ ...mainData, reviewability: updateValue as Reviewability })
                    setIsDirty(true)
                  }}
                  options={[
                    { value: Reviewability.Always, text: 'Always' },
                    { value: Reviewability.Never, text: 'Never' },
                    {
                      value: Reviewability.OptionalIfNoResponse,
                      text: 'Optional (if no application response)',
                    },
                    {
                      value: Reviewability.OnlyIfApplicantAnswer,
                      text: 'Only if applicant answered',
                    },
                  ]}
                  maxLabelWidth={120}
                />
              </div>
            )}
            <div className="full-width-container">
              <TextIO
                text={mainData?.validationMessage || ''}
                title="Validation Message"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                isTextArea={true}
                setText={(text) => {
                  setMainData({ ...mainData, validationMessage: text || null })
                }}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={100}
                maxLabelWidth={100}
                labelTextAlign="right"
                textAreaDefaultRows={3}
              />
            </div>
            <div className="full-width-container">
              <TextIO
                text={mainData?.helpText || ''}
                isTextArea={true}
                title="Help Text"
                disabled={!canEdit}
                disabledMessage={disabledMessage}
                setText={(text) => {
                  setMainData({ ...mainData, helpText: text || null })
                }}
                markNeedsUpdate={() => setIsDirty(true)}
                isPropUpdated={true}
                minLabelWidth={100}
                maxLabelWidth={100}
                labelTextAlign="right"
              />
            </div>
            <UndoRedo canUndo={canUndoMain} canRedo={canRedoMain} undo={undoMain} redo={redoMain} />
          </div>
          <div className="spacer-10" />
          <div className="config-container-alternate">
            <Header as="h4">Common Properties</Header>
            {evaluations.map(({ key, title }) => (
              <Evaluation
                figTree={FigTree}
                label={title}
                key={key}
                evaluation={commonData[key]}
                setEvaluation={(expression) => setCommonDataItem(key, expression)}
                canEdit={canEdit}
                objectData={{
                  responses: {
                    ...structure?.responsesByCode,
                    thisResponse: structure?.responsesByCode?.[mainData.code]?.text,
                  },
                  currentUser,
                  applicationData: { ...structure?.info, currentPageType: 'application' },
                }}
                resetExpression={(expression) => {
                  resetCommon({ ...commonData, [key]: expression })
                  setIsDirty(true)
                }}
              />
            ))}
            <div className="spacer-10" />
            <UndoRedo
              canUndo={canUndoCommon}
              canRedo={canRedoCommon}
              undo={undoCommon}
              redo={redoCommon}
            />
          </div>
          <Parameters
            figTree={FigTree}
            key="parametersElement"
            currentElementCode={mainData.code}
            fullStructure={structure}
            parameters={parameters}
            setParameters={(params) => setParameters(params)}
            setIsDirty={setIsDirty}
            reset={(expression, key) => {
              if (key) {
                const newParameters = { ...parameters }
                delete newParameters[key]
                resetParameters({ ...parameters, [key]: expression })
              } else {
                resetParameters(expression)
              }
            }}
            canEdit={canEdit}
            type="FormElement"
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
              onClick={updateElement}
            />
            <ButtonWithFallback
              disabled={!canEdit}
              disabledMessage={disabledMessage}
              title={t('BUTTON_REMOVE')}
              onClick={() => showRemoveElementModal({ onConfirm: () => removeElement() })}
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
      <RemoveElementModal />
    </Modal>
  )
}

export default ElementConfig
