import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
import React, { useEffect, useState } from 'react'
import { Modal, Label, Icon, Header, Message, ModalProps } from 'semantic-ui-react'
import { pluginProvider } from '../../../../formElementPlugins'
import { TemplateElement, TemplateElementCategory } from '../../../../utils/generated/graphql'
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
import ModalConfirmation from '../../../../components/Main/ModalConfirmation'

type ElementConfigProps = {
  element: TemplateElement | null
  onClose: () => void
}

type ElementUpdateState = {
  code: string
  title: string
  category: TemplateElementCategory
  elementTypePluginCode: string
  visibilityCondition: EvaluatorNode
  isRequired: EvaluatorNode
  isEditable: EvaluatorNode
  validation: EvaluatorNode
  validationMessage: string
  helpText: string
  parameters: ParametersType
  defaultValue: EvaluatorNode
  id: number
}

type GetState = (element: TemplateElement) => ElementUpdateState

const getState: GetState = (element: TemplateElement) => ({
  code: element.code || '',
  title: element.title || '',
  category: element.category || TemplateElementCategory.Information,
  elementTypePluginCode: element.elementTypePluginCode || '',
  visibilityCondition: element.visibilityCondition,
  isRequired: element.isRequired,
  isEditable: element.isEditable,
  validation: element.validation,
  helpText: element.helpText || '',
  validationMessage: element.validationMessage || '',
  parameters: element.parameters || {},
  defaultValue: element.defaultValue || null,
  id: element.id,
})

type Evaluations = {
  key: keyof ElementUpdateState
  title: string
}[]

const evaluations: Evaluations = [
  { key: 'isEditable', title: 'Is Editable' },
  { key: 'isRequired', title: 'Is Required' },
  { key: 'validation', title: 'Is Valid' },
  { key: 'visibilityCondition', title: 'Is Visible' },
  { key: 'defaultValue', title: 'Default Value' },
]

const ElementConfig: React.FC<ElementConfigProps> = ({ element, onClose }) => {
  const { strings } = useLanguageProvider()

  const REMOVE_MESSAGE = {
    title: strings.TEMPLATE_MESSAGE_REMOVE_ELEMENT_TITLE,
    message: strings.TEMPLATE_MESSAGE_REMOVE_ELEMENT_CONTENT,
    option: strings.BUTTON_CONFIRM,
  }

  const { structure } = useFullApplicationState()
  const {
    template: { isDraft },
  } = useTemplateState()
  const { selectedSectionId } = useFormState()
  const { updateApplication, updateTemplateSection } = useOperationState()
  const [state, setState] = useState<ElementUpdateState | null>(null)
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false)
  const [showSaveAlert, setShowSaveAlert] = useState<boolean>(false)
  const [open, setOpen] = useState(false) // TODO: Use ConfirmationModal (2 actions...)
  const [showRemoveElementModal, setShowRemoveElementModal] = useState<ModalProps>({ open: false })

  useEffect(() => {
    if (!element) return setState(null)
    setState(getState(element))
    setShowSaveAlert(false)
  }, [element])

  if (!state || !element) return null

  const removeElement = async () => {
    const applicationResponseId =
      structure?.elementsById?.[state.id]?.latestApplicationResponse?.id || null

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
        deleteById: [{ id: state.id }],
      },
    })
    if (!result) return

    onClose()
  }

  const updateElement = async () => {
    const result = await updateTemplateSection(selectedSectionId, {
      templateElementsUsingId: {
        updateById: [{ id: state.id, patch: state }],
      },
    })
    setShouldUpdate(false)
    setShowSaveAlert(true)
    setTimeout(() => setShowSaveAlert(false), 2000)
    if (!result) return
  }

  const saveAndClose = () => {
    updateElement()
    onClose()
  }

  const markNeedsUpdate = () => {
    setShouldUpdate(true)
    setShowSaveAlert(false)
  }

  const confirmAndRemove = () => {
    setShowRemoveElementModal({
      ...REMOVE_MESSAGE,
      open: true,
      onClick: () => {
        removeElement()
        setShowRemoveElementModal({ open: false })
      },
      onClose: () => setShowRemoveElementModal({ open: false }),
    })
  }

  return (
    <Modal className="config-modal" open={true}>
      <div className="config-modal-container">
        <div className="config-modal-header">
          <Header as="h3">{state.title}</Header>
          <div className="flex-column">
            <DropdownIO
              title="Type"
              value={state.elementTypePluginCode}
              getKey={'code'}
              getValue={'code'}
              getText={'displayName'}
              setValue={(value) => {
                setState({ ...state, elementTypePluginCode: String(value) })
                markNeedsUpdate()
              }}
              options={Object.values(pluginProvider.pluginManifest)}
              labelNegative
              minLabelWidth={50}
            />
            <FromExistingElement
              pluginCode={state.elementTypePluginCode}
              setTemplateElement={(existingElement) => {
                setState({ ...state, ...existingElement })
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
            href="https://github.com/openmsupply/application-manager-web-app/wiki/Element-Type-Specs"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="config-modal-info">
          {!isDraft && <Label color="red">Template form only editable on draft templates</Label>}
          <div className="spacer-10" />
          <div className="config-container-outline" style={{ maxWidth: 600 }}>
            <div className="flex-row-start-start">
              <div className="full-width-container">
                <TextIO
                  text={state.title}
                  title="Title"
                  setText={(text) => {
                    setState({ ...state, title: text })
                  }}
                  markNeedsUpdate={markNeedsUpdate}
                  isPropUpdated={true}
                  minLabelWidth={60}
                  maxLabelWidth={60}
                />
              </div>
            </div>
            <div className="flex-row-start-start">
              <TextIO
                text={state.code}
                title="Code"
                setText={(text) => {
                  setState({ ...state, code: text })
                }}
                markNeedsUpdate={markNeedsUpdate}
                isPropUpdated={true}
                minLabelWidth={60}
                maxLabelWidth={60}
              />
              <DropdownIO
                title="Category"
                value={state.category}
                getKey={'category'}
                getValue={'category'}
                getText={'title'}
                isPropUpdated={true}
                setValue={(value) => {
                  setState({ ...state, category: value as TemplateElementCategory })
                  markNeedsUpdate()
                }}
                options={[
                  { category: TemplateElementCategory.Information, title: 'Information' },
                  { category: TemplateElementCategory.Question, title: 'Question' },
                ]}
              />
            </div>
            <div className="flex-row-start-center-wrap">
              <div className="full-width-container">
                <TextIO
                  text={state.validationMessage}
                  title="Validation Message"
                  isTextArea={true}
                  setText={(text) => {
                    setState({ ...state, validationMessage: text })
                  }}
                  markNeedsUpdate={markNeedsUpdate}
                  isPropUpdated={true}
                  minLabelWidth={100}
                  maxLabelWidth={100}
                  labelTextAlign="right"
                  textAreaDefaultRows={3}
                />
              </div>
            </div>
            <div className="flex-row-start-center-wrap">
              <div className="full-width-container">
                <TextIO
                  text={state.helpText}
                  isTextArea={true}
                  title="Help Text"
                  setText={(text) => {
                    setState({ ...state, helpText: text })
                  }}
                  markNeedsUpdate={markNeedsUpdate}
                  isPropUpdated={true}
                  minLabelWidth={100}
                  maxLabelWidth={100}
                  labelTextAlign="right"
                />
              </div>
            </div>
          </div>
          <div className="spacer-10" />
          <div className="config-container-alternate">
            <Header as="h4">Common Properties</Header>
            {evaluations.map(({ key, title }) => (
              <Evaluation
                label={title}
                key={key}
                currentElementCode={state.code}
                fullStructure={structure}
                evaluation={state[key]}
                setEvaluation={(evaluation) => {
                  setState({ ...state, [key]: evaluation })
                  markNeedsUpdate()
                }}
                type="FormElement"
              />
            ))}
          </div>
          <div className="spacer-10" />
          <Parameters
            key="parametersElement"
            currentElementCode={state.code}
            fullStructure={structure}
            parameters={state.parameters}
            setParameters={(parameters) => {
              setState({ ...state, parameters })
              markNeedsUpdate()
            }}
            type="FormElement"
          />
          <div className="spacer-20" />
          <div className="flex-row-center-center">
            <ButtonWithFallback
              title={strings.BUTTON_SAVE}
              disabled={!isDraft || !shouldUpdate}
              disabledMessage={!isDraft ? disabledMessage : strings.TEMPLATE_MESSAGE_SAVE_DISABLED}
              onClick={updateElement}
            />
            <ButtonWithFallback
              disabled={!isDraft}
              disabledMessage={disabledMessage}
              title={strings.BUTTON_REMOVE}
              onClick={confirmAndRemove}
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
      <ModalConfirmation {...showRemoveElementModal} />
      <Message
        className="alert-success"
        success
        icon={<Icon name="check circle outline" />}
        header={strings.TEMPLATE_MESSAGE_SAVE_SUCCESS}
        hidden={!showSaveAlert}
        onClick={() => setShowSaveAlert(false)}
      />
    </Modal>
  )
}

export default ElementConfig
