import React from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { Header, Button, Dropdown, Icon } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import usePageTitle from '../../../utils/hooks/usePageTitle'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import { nanoid } from 'nanoid'
import { useFragmentConfig, Fragment } from './useFragmentConfig'
import { JsonEditor as ReactJson } from 'json-edit-react'
import { FigTreeEditor } from 'fig-tree-editor-react'
import { FigTree } from '../../../FigTreeEvaluator'
import { UndoRedoSave } from '../JsonEditor/UndoRedoSave'

export const EvaluatorFragments: React.FC = () => {
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
          placeholder={t('DATA_VIEW_CONFIG_SELECT_VIEW')}
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
                title: t('DATA_VIEW_CONFIG_DELETE_WARNING'),
                message: t('DATA_VIEW_CONFIG_DELETE_MESSAGE'),
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
            figTree={FigTree}
            onEvaluate={() => {}}
            rootName={'Expression Fragment'}
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
            rootName=""
            collapse={2}
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
                title: t('DATA_VIEW_CONFIG_SAVE_WARNING'),
                message: t('DATA_VIEW_CONFIG_SAVE_MESSAGE'),
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
