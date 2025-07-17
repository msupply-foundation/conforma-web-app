import React from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { Header, Button, Dropdown, Icon } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import usePageTitle from '../../../utils/hooks/usePageTitle'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { nanoid } from 'nanoid'
import { useFragmentConfig, Fragment } from './useFragmentConfig'
import { JsonEditor as ReactJson } from 'json-edit-react'
import { FigTreeEditor, FigTreeEvaluator } from 'fig-tree-editor-react'
import { FigTree } from '../../../FigTreeEvaluator'
import { UndoRedoSave } from '../JsonEditor/UndoRedoSave'

console.log('Using Fragment Editor')

const { fragments: _, ...originalFigTreeOptions } = FigTree.getOptions()

console.log('FigTree Options', originalFigTreeOptions)

// Use a new instance of FigTreeEvaluator here, as we need to remove the
// fragments, as the Fragment Editor shouldn't be able to reference other
// fragments (in theory they could, but it could cause problems with an
// accidental circular reference).
const FigTreeFragments = new FigTreeEvaluator(originalFigTreeOptions)

const EvaluatorFragments: React.FC = () => {
  const { t } = useLanguageProvider()
  usePageTitle(t('EVALUATOR_FRAGMENTS_HEADER'))

  const { updateQuery } = useRouter()

  const { ConfirmModal, showModal: showConfirmation } = useConfirmationModal({
    type: 'warning',
    confirmText: t('BUTTON_CONFIRM'),
  })

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
  } = useFragmentConfig()

  return (
    <div id="data-view-config-panel" className="flex-column" style={{ gap: 15 }}>
      <div className="flex-row-space-between-center">
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
      <div className="flex-row-space-between">
        <Dropdown
          selection
          clearable
          placeholder={t('EVALUATOR_FRAGMENT_SELECT_FRAGMENT')}
          loading={loading}
          value={selectedFragment}
          options={getFragmentOptions(fragments)}
          onChange={(_, { value }) => {
            if (fragments) updateQuery({ fragment: value })
          }}
          style={{ minWidth: 300, zIndex: 50 }}
        />
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
                variables: {
                  name: `Fragment_${nanoid(8)}`,
                  expression: {},
                  metadata: {},
                  frontEnd: true,
                  backEnd: true,
                  permissionNames: [],
                },
              })
            }}
          />
        </div>
      </div>
      {fragmentData && (
        <div className="flex-column" style={{ width: '100%' }}>
          <ConfirmModal />
          <FigTreeEditor
            expression={expression ?? {}}
            setExpression={(newExpression) =>
              updateDraft(newExpression as Partial<Fragment>, 'expression')
            }
            figTree={FigTreeFragments}
            onEvaluate={() => {}}
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
              },
            }}
          />
          <ReactJson
            data={fragmentData}
            setData={(newData) => updateDraft(newData as Partial<Fragment>, 'other')}
            rootName="Data"
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
          />
          <UndoRedoSave
            {...undoProps}
            isDirty={true}
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
      )}
    </div>
  )
}

const getFragmentOptions = (fragments: Fragment[] | undefined) => {
  if (!fragments) return []

  return fragments.map((fragment) => {
    const { id, name } = fragment
    return {
      key: `${name}_${id}`,
      text: name,
      value: name,
      data: fragment,
    }
  })
}

export default EvaluatorFragments
