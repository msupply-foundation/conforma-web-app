import { useRouter } from '../../../utils/hooks/useRouter'
import { Header, Button, Dropdown, Icon, DropdownMenu, DropdownItem } from 'semantic-ui-react'
import Ajv from 'ajv'
import { useLanguageProvider } from '../../../contexts/Localisation'
import usePageTitle from '../../../utils/hooks/usePageTitle'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { useFragmentConfig, FragmentRow } from './useFragmentConfig'
import { JsonEditor as ReactJson } from 'json-edit-react'
import { FigTreeEditor, FigTreeEvaluator } from 'fig-tree-editor-react'
import { FigTree } from '../../../FigTreeEvaluator'
import { UndoRedoSave } from '../JsonEditor/UndoRedoSave'
import { onEvaluateErrorNotify, onEvaluateNotify } from '../../common/evaluatorHelpers'
import { Position, useToast } from '../../../contexts/Toast'
import { handleCopyToClipboard } from '../JsonEditor'
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

  const { ConfirmModal, showModal: showConfirmation } = useConfirmationModal({
    type: 'warning',
    confirmText: t('BUTTON_CONFIRM'),
  })

  const { showToast } = useToast({ position: Position.topMiddle })

  const {
    fragments,
    loading,
    selectedFragment,
    draftState: { id, expression, fragmentData },
    updateDraft,
    undoProps,
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
    isDirty,
  } = useFragmentConfig()

  return (
    <div id="fragment-config-panel" className="flex-column" style={{ gap: 15 }}>
      <div className="flex-row-space-between-center" style={{ maxWidth: 700 }}>
        <Header>{t('EVALUATOR_FRAGMENTS_HEADER')}</Header>
        <p className="slightly-smaller-text">
          <a
            href="https://github.com/CarlosNZ/fig-tree-evaluator?tab=readme-ov-file#fragments"
            target="_blank"
          >
            Docs <Icon name="external" />
          </a>
        </p>
      </div>
      <ConfirmModal />
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
              showConfirmation({
                title: t('EVALUATOR_FRAGMENT_DELETE_WARNING'),
                message: t('EVALUATOR_FRAGMENT_DELETE_MESSAGE'),
                onConfirm: () => deleteFragment({ variables: { id } }),
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
              addFragment({
                variables: defaultNewFragment,
              })
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
              />
              <ReactJson
                data={fragmentData}
                setData={(newData) => updateDraft(newData as Partial<FragmentRow>, 'other')}
                rootName="Properties"
                collapse={4}
                showArrayIndices={false}
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
                showCollectionCount="when-closed"
                enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
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
                      title: 'Not compliant with JSON Schema',
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
              />
              <UndoRedoSave
                {...undoProps}
                isDirty={isDirty}
                isSaving={isSaving}
                handleSave={() => {
                  showConfirmation({
                    title: t('EVALUATOR_FRAGMENT_CONFIG_SAVE_WARNING'),
                    message: t('EVALUATOR_FRAGMENT_CONFIG_SAVE_MESSAGE'),
                    onConfirm: () =>
                      updateFragment({
                        variables: { id, patch: { expression, ...fragmentData } },
                      }),
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
