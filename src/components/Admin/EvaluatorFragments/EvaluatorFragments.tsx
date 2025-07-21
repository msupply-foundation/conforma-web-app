import { useRouter } from '../../../utils/hooks/useRouter'
import { Header, Button, Dropdown, Icon, DropdownMenu, DropdownItem } from 'semantic-ui-react'
import Ajv from 'ajv'
import JSON5 from 'json5'
import { useLanguageProvider } from '../../../contexts/Localisation'
import usePageTitle from '../../../utils/hooks/usePageTitle'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { useFragmentConfig, FragmentRow, FragmentDataProperties } from './useFragmentConfig'
import {
  ReactJson,
  handleCopyToClipboard,
  UndoRedoSave,
  newKeyOptions,
  defaultValue,
} from '../JsonEditor'
import { FigTreeEditor, FigTreeEvaluator, Fragment } from 'fig-tree-editor-react'
import { FigTree } from '../../../FigTreeEvaluator'
import { onEvaluateErrorNotify, onEvaluateNotify } from '../../common/evaluatorHelpers'
import { Position, useToast } from '../../../contexts/Toast'
import { FragmentTester } from './FragmentTester'
import { FragmentDataSchema } from './schema'
import { DataContainer } from './DataContainer'
import { defaultNewFragment } from './default'

const { fragments: _, ...originalFigTreeOptions } = FigTree.getOptions()

// Use a new instance of FigTreeEvaluator here, as we need to remove the
// fragments, as the Fragment Editor shouldn't be able to reference other
// fragments (in theory they could, but it could cause problems with an
// accidental circular reference).
const FigTreeFragments = new FigTreeEvaluator(originalFigTreeOptions)

const ajv = new Ajv()
const validateFragment = ajv.compile(FragmentDataSchema)

const EvaluatorFragments = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('EVALUATOR_FRAGMENTS_HEADER'))

  const { updateQuery } = useRouter()

  const { ConfirmModal: ConfirmSaveModal, showModal: showSaveConfirmation } = useConfirmationModal({
    type: 'warning',
    confirmText: t('BUTTON_CONFIRM'),
  })
  const { ConfirmModal: ConfirmUpdateOrNewModal, showModal: showUpdateOrNewModal } =
    useConfirmationModal({
      title: t('EVALUATOR_FRAGMENT_NAME_CHANGED'),
      message: t('EVALUATOR_FRAGMENT_NAME_CHANGE_MESSAGE'),
      confirmText: t('EVALUATOR_FRAGMENT_CONFIRM_EDIT'),
      cancelText: t('EVALUATOR_FRAGMENT_CONFIRM_NEW'),
    })

  const { showToast } = useToast({ position: Position.topMiddle })

  const {
    fragments,
    loading,
    selectedFragment,
    draftState,
    updateDraft,
    resetDraft,
    undoProps,
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
    isDirty,
  } = useFragmentConfig()

  const { id, expression, fragmentData } = draftState as {
    id: number
    expression: Fragment
    fragmentData: FragmentDataProperties
  }

  return (
    <div id="fragment-config-panel" className="flex-column" style={{ gap: 15 }}>
      <div className="flex-row-space-between-center" style={{ maxWidth: 700 }}>
        <Header>{t('EVALUATOR_FRAGMENTS_HEADER')}</Header>
        <p className="slightly-smaller-text">
          <a href="https://github.com/CarlosNZ/fig-tree-evaluator#fragments" target="_blank">
            Docs <Icon name="external" />
          </a>
        </p>
      </div>
      <ConfirmSaveModal />
      <ConfirmUpdateOrNewModal />
      <div className="flex-row-space-between" style={{ maxWidth: 700, gap: '2em' }}>
        <Dropdown
          selection
          clearable
          placeholder={t('EVALUATOR_FRAGMENT_SELECT_FRAGMENT')}
          loading={loading}
          value={selectedFragment}
          text={selectedFragment}
          style={{ minWidth: 300, zIndex: 50 }}
          onChange={(_, { value }) => {
            // This handles the clear action when 'x' is clicked
            if (value === '') updateQuery({ fragment: null })
          }}
        >
          <DropdownMenu>
            {getFragmentOptions(fragments).map(({ key, text, value, description }) => (
              <DropdownItem
                key={key}
                value={value}
                onClick={() => updateQuery({ fragment: value })}
              >
                {text}
                <br />
                <span className="slightly-smaller-text">{description}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div>
          <Button
            primary
            inverted
            disabled={!selectedFragment}
            loading={isDeleting}
            icon={<Icon name="trash alternate outline" size="small" />}
            content={t('DATA_VIEW_CONFIG_DELETE_BUTTON')}
            onClick={() =>
              showSaveConfirmation({
                title: t('EVALUATOR_FRAGMENT_DELETE_WARNING'),
                message: t('EVALUATOR_FRAGMENT_DELETE_MESSAGE'),
                onConfirm: () => {
                  if (id) deleteFragment({ variables: { id } })
                  else resetDraft()
                },
                awaitAction: false,
              })
            }
          />
          <Button
            primary
            inverted
            loading={isAdding}
            icon={<Icon name="plus" size="tiny" color="blue" />}
            content={t('DATA_VIEW_CONFIG_ADD_BUTTON')}
            onClick={() => {
              updateDraft(defaultNewFragment, 'full')
            }}
          />
        </div>
      </div>
      {fragmentData && (
        <div className="flex-column" style={{}}>
          <FragmentTester
            figTree={FigTreeFragments}
            fragmentExpression={expression}
            fragmentData={fragmentData}
            onEvaluate={(result, e) => onEvaluateNotify(result, e, showToast)}
            onError={(err) => onEvaluateErrorNotify(err, showToast)}
          />
          <div className="flex-row-space-between">
            <div className="flex-column" style={{ width: '100%', maxWidth: 700 }}>
              <FigTreeEditor
                expression={expression ?? {}}
                setExpression={(newExpression) =>
                  updateDraft(newExpression as Partial<FragmentRow>, 'expression')
                }
                figTree={FigTreeFragments}
                onEvaluate={(result, e) => onEvaluateNotify(result, e, showToast)}
                onEvaluateError={(err) => onEvaluateErrorNotify(err, showToast)}
                enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
                rootName={'Fragment'}
                collapse={2}
                showArrayIndices={false}
                maxWidth={'100%'}
                styles={{
                  container: {
                    backgroundColor: '#fefefe',
                    marginBottom: '0.8em',
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                    position: 'relative',
                  },
                }}
                jsonParse={JSON5.parse}
              />
              <ReactJson
                data={fragmentData}
                setData={(newData) => {
                  // If changing from the default new fragment, we definitely
                  // want to create a new one
                  if ((newData as Partial<FragmentRow>)?.name === defaultNewFragment.name) {
                    updateDraft({ expression, ...(newData as Partial<FragmentRow>) }, 'full')
                    return
                  }
                  // If the name has changed, we need to confirm whether or not
                  // to overwrite the currently selected fragment, or create a
                  // new one
                  if ((newData as Partial<FragmentRow>)?.name !== fragmentData?.name) {
                    showUpdateOrNewModal({
                      onConfirm: () => {
                        updateDraft(newData as Partial<FragmentRow>, 'other')
                      },
                      onCancel: () => {
                        // Remove the ID, so it's treated as a new fragment
                        updateDraft({ expression, ...(newData as Partial<FragmentRow>) }, 'full')
                      },
                      awaitAction: false,
                    })
                    return
                  }
                  updateDraft(newData as Partial<FragmentRow>, 'other')
                }}
                rootName="Properties"
                collapse={4}
                maxWidth={'100%'}
                restrictAdd={({ level }) => level === 0}
                restrictDelete={({ level }) => level === 1}
                theme={{
                  container: {
                    backgroundColor: '#fefefe',
                    marginBottom: '1em',
                    paddingTop: '0.5em',
                    paddingBottom: '0.5em',
                  },
                }}
                onUpdate={({ newData }) => {
                  const valid = validateFragment(newData)
                  if (!valid) {
                    console.log('Errors', validateFragment.errors)
                    const errorMessage = validateFragment.errors
                      ?.map(
                        (error) =>
                          `${error.instancePath}${error.instancePath ? ': ' : ''}${error.message}`
                      )
                      .join('\n')
                    showToast({
                      title: 'Invalid entry',
                      text: errorMessage,
                      style: 'error',
                      timeout: 10_000,
                      maxWidth: 650,
                      position: Position.topMiddle,
                    })
                    // This string returned to and displayed in json-edit-react UI
                    return 'JSON Schema error'
                  }
                }}
                newKeyOptions={(input) => newKeyOptions(input, defaultNewFragment)}
                defaultValue={(input, key) => defaultValue(input, key, defaultNewFragment)}
              />
              <UndoRedoSave
                {...undoProps}
                isDirty={isDirty}
                isSaving={isSaving}
                handleSave={() => {
                  showSaveConfirmation({
                    title: t('EVALUATOR_FRAGMENT_CONFIG_SAVE_WARNING'),
                    message: id
                      ? t('EVALUATOR_FRAGMENT_CONFIG_SAVE_MESSAGE')
                      : t('EVALUATOR_FRAGMENT_CONFIG_ADD_MESSAGE'),
                    onConfirm: () => {
                      if (id)
                        updateFragment({
                          variables: { id, patch: { expression, ...fragmentData } },
                        })
                      else {
                        addFragment({
                          variables: { expression, ...fragmentData },
                        })
                      }
                    },
                    awaitAction: false,
                  })
                }}
              />
            </div>
            {selectedFragment && <DataContainer figTree={FigTreeFragments} />}
          </div>
        </div>
      )}
    </div>
  )
}

const getFragmentOptions = (fragments: FragmentRow[] | undefined) => {
  if (!fragments) return []

  return fragments.map((fragment) => {
    const { id, name, metadata } = fragment
    return {
      key: `${name}_${id}`,
      text: name,
      value: name,
      description: metadata?.description ?? '',
    }
  })
}

export default EvaluatorFragments
