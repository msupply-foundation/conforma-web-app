import { EvaluatorNode } from '@openmsupply/expression-evaluator/lib/types'
import React, { useEffect, useState } from 'react'
import { Modal, Label, Icon, Header } from 'semantic-ui-react'
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
  const { structure } = useFullApplicationState()
  const {
    template: { isDraft },
  } = useTemplateState()
  const { selectedSectionId } = useFormState()
  const { updateApplication, updateTemplateSection } = useOperationState()
  const [state, setState] = useState<ElementUpdateState | null>(null)
  const [isUpdated, setIsUpdated] = useState<boolean>(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!element) return setState(null)
    setState(getState(element))
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
    setIsUpdated(true)
    if (!result) return
  }

  const saveAndClose = () => {
    updateElement()
    onClose()
  }

  return (
    <Modal className="config-modal" open={true}>
      <div className="config-modal-container">
        {!isDraft && <Label color="red">Template form only editable on draft templates</Label>}
        <Label className="element-edit-info" attached="top right">
          <a
            href="https://github.com/openmsupply/application-manager-web-app/wiki/Element-Type-Specs"
            target="_blank"
          >
            <Icon name="info circle" size="big" color="blue" />
          </a>
        </Label>
        <div className="flex-row-center-center-wrap">
          <DropdownIO
            title="Type"
            value={state.elementTypePluginCode}
            getKey={'code'}
            getValue={'code'}
            getText={'displayName'}
            setValue={(value) => {
              setState({ ...state, elementTypePluginCode: String(value) })
              setIsUpdated(false)
            }}
            options={Object.values(pluginProvider.pluginManifest)}
          />

          <FromExistingElement
            pluginCode={state.elementTypePluginCode}
            setTemplateElement={(existingElement) => {
              setState({ ...state, ...existingElement })
              setIsUpdated(false)
            }}
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
              setIsUpdated(false)
            }}
            options={[
              { category: TemplateElementCategory.Information, title: 'Information' },
              { category: TemplateElementCategory.Question, title: 'Question' },
            ]}
          />

          <TextIO
            text={state.code}
            title="Code"
            setText={(text) => {
              setState({ ...state, code: text })
              setIsUpdated(false)
            }}
            isPropUpdated={true}
          />
          <div className="long">
            <TextIO
              text={state.title}
              title="Title"
              setText={(text) => {
                setState({ ...state, title: text })
                setIsUpdated(false)
              }}
              isPropUpdated={true}
            />
          </div>
        </div>

        <div className="flex-row-center-center">
          <div className="long">
            <TextIO
              text={state.validationMessage}
              title="Validation Message"
              isTextArea={true}
              setText={(text) => {
                setState({ ...state, validationMessage: text })
                setIsUpdated(false)
              }}
              isPropUpdated={true}
            />
          </div>
          <div className="long">
            <TextIO
              text={state.helpText}
              isTextArea={true}
              title="Help Text"
              setText={(text) => {
                setState({ ...state, helpText: text })
                setIsUpdated(false)
              }}
              isPropUpdated={true}
            />
          </div>
        </div>
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
                setIsUpdated(false)
              }}
            />
          ))}
        </div>
        <Parameters
          key="parametersElement"
          currentElementCode={state.code}
          fullStructure={structure}
          parameters={state.parameters}
          setParameters={(parameters) => {
            setState({ ...state, parameters })
            setIsUpdated(false)
          }}
        />

        <div className="spacer-20" />
        <div className="flex-row-center-center">
          <ButtonWithFallback
            title="Save"
            disabled={!isDraft}
            disabledMessage={disabledMessage}
            onClick={updateElement}
          />
          <ButtonWithFallback
            disabled={!isDraft}
            disabledMessage={disabledMessage}
            title="Remove"
            onClick={removeElement}
          />
          <ButtonWithFallback
            title="Close"
            onClick={() => (isUpdated ? onClose() : setOpen(true))}
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

export default ElementConfig
