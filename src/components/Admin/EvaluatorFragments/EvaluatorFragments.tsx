import React, { Suspense, useState } from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import {
  Header,
  Button,
  Dropdown,
  Checkbox,
  Icon,
  DropdownItemProps,
  DropdownProps,
} from 'semantic-ui-react'
import { TranslateMethod, useLanguageProvider } from '../../../contexts/Localisation'
import usePageTitle from '../../../utils/hooks/usePageTitle'
import useConfirmationModal from '../../../utils/hooks/useConfirmationModal'
import {
  DataTable,
  DataView,
  DataViewColumnDefinition,
  EvaluatorFragment,
  GetDataTablesQuery,
  useGetDataTablesQuery,
} from '../../../utils/generated/graphql'
import { camelCase, pickBy, startCase } from 'lodash-es'
import { nanoid } from 'nanoid'
import { useFragmentConfig } from './useFragmentConfig'
import config from '../../../config'
import { JsonData } from 'json-edit-react'
import { Loading } from '../../common'
import { dequal, FigTreeEditor } from 'fig-tree-editor-react'
import { FigTree } from '../../../FigTreeEvaluator'
import { fr, is } from 'date-fns/locale'
import { setEngine } from 'crypto'

const JsonEditor = React.lazy(() => import('../JsonEditor/JsonEditor'))

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
          style={{ minWidth: 300 }}
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
        <>
          <ConfirmModal />
          <FigTreeEditor
            expression={expression ?? {}}
            setExpression={(newExpression) => updateDraft(newExpression, 'expression')}
            figTree={FigTree}
            onEvaluate={() => {}}
            // onSave={onSave}
            // isSaving={isSaving}
            rootName={fragmentData.name}
            collapse={2}
            showArrayIndices={false}
          />
          <JsonEditor
            data={fragmentData}
            setData={(newData) => updateDraft(newData, 'other')}
            // onSave={onSave}
            isSaving={isSaving}
            rootName={fragmentData?.name ?? ''}
            collapse={2}
            showArrayIndices={false}
            maxWidth={650}
            showSaveButton={false}
            showSearch={false}
            restrictAdd={({ level }) => level === 0}
            restrictDelete={({ level }) => level === 1}
          />
        </>
      )}
      {/* // <FragmentDisplay
        //   title={t('PAGE_TITLE_DATA_VIEW')}
        //   placeholder={t('DATA_VIEW_CONFIG_SELECT_VIEW')}
        //   loading={loading}
        //   dropdownValue={selectedFragment}
        //   options={getFragmentOptions(fragments)}
        //   onChange={(_, { value }) => {
        //     if (fragments) updateQuery({ fragment: value })
        //   }}
        //   data={fragmentObject}
        //   dataName={fragmentObject?.name as string}
        //   onSave={(data) => {
        //     showConfirmation({
        //       title: t('DATA_VIEW_CONFIG_SAVE_WARNING'),
        //       message: t('DATA_VIEW_CONFIG_SAVE_MESSAGE'),
        //       onConfirm: () =>
        //         updateFragment({
        //           variables: { id: fragmentObject?.id as number, patch: data as object },
        //         }),
        //       awaitAction: false,
        //     })
        //   }}
        //   isSaving={isSaving}
        //   onDelete={() =>
        //     showConfirmation({
        //       title: t('DATA_VIEW_CONFIG_DELETE_WARNING'),
        //       message: t('DATA_VIEW_CONFIG_DELETE_MESSAGE'),
        //       onConfirm: () => deleteFragment({ variables: { id: fragmentObject?.id as number } }),
        //       awaitAction: false,
        //     })
        //   }
        //   isDeleting={isDeleting}
        //   onAdd={() => {
        //     addFragment({
        //       variables: {
        //         name: `Fragment_${nanoid(8)}`,
        //         expression: {},
        //         metadata: {},
        //         frontEnd: true,
        //         backEnd: true,
        //         permissionNames: [],
        //       },
        //     })
        //   }}
        //   isAdding={isAdding}
        // /> */}
    </div>
  )
}

interface DataViewDisplayProps {
  title: string
  placeholder: string
  loading: boolean
  dropdownValue: string
  options: DropdownItemProps[]
  onChange: (_: unknown, value: DropdownProps) => void
  data: EvaluatorFragment
  dataName: string
  onSave: (data: JsonData) => void
  isSaving: boolean
  onDelete: () => void
  isDeleting: boolean
  onAdd: () => void
  isAdding: boolean
  isLookupTable?: boolean
}

// const FragmentDisplay: React.FC<DataViewDisplayProps> = ({
//   title,
//   // placeholder,
//   // loading,
//   // dropdownValue,
//   // options,
//   // onChange,
//   data,
//   dataName,
//   // onSave,
//   // isSaving,
//   // onDelete,
//   // isDeleting,
//   // onAdd,
//   // isAdding,
// }) => {
//   const { t } = useLanguageProvider()
//   const { ConfirmModal } = useConfirmationModal({
//     type: 'warning',
//     confirmText: t('BUTTON_CONFIRM'),
//   })
//   const [fragment, setFragment] = useState<any>({
//     __typename: 'EvaluatorFragment',
//     id: 10,
//     name: 'Get Flag',
//     expression: {
//       operator: 'GET',
//       children: [
//         {
//           operator: 'stringSubstitution',
//           string: 'https://restcountries.com/v3.1/name/%1',
//           replacements: ['$country'],
//         },
//         [],
//         'flag',
//       ],
//       outputType: 'string',
//     },
//     metadata: {
//       textColor: 'white',
//       parameters: [
//         {
//           name: '$country',
//           type: 'string',
//           default: 'New Zealand',
//           required: true,
//         },
//       ],
//       description: "Gets a country's flag",
//       backgroundColor: 'black',
//     },
//     frontEnd: true,
//     backEnd: false,
//     permissionNames: null,
//   })

//   // const { expression, ...rest } = fragment
//   // const metadata = rest.metadata || {}
//   // const { parameters = {}, ...otherMetadata } = metadata

//   // const mainData = { parameters, ...rest, display: { ...otherMetadata } }

//   return (
//     <div>
//       <Header as="h2">{title}</Header>
//       <ConfirmModal />
//       <p>HERE IT IS</p>
//       <FigTreeEditor
//         expression={fragment}
//         setExpression={
//           (newExpression) => setFragment(newExpression)
//           // setFragment((prev) => ({ ...prev, expression: newExpression }))
//         }
//         figTree={FigTree}
//         onEvaluate={() => {}}
//         // onSave={onSave}
//         // isSaving={isSaving}
//         rootName={dataName}
//         collapse={1}
//         showArrayIndices={false}
//       />
//       {
//         // <Suspense fallback={<Loading />}>
//         //   <FigTreeEditor
//         //     expression={fragment}
//         //     setExpression={
//         //       (newExpression) => setFragment(newExpression)
//         //       // setFragment((prev) => ({ ...prev, expression: newExpression }))
//         //     }
//         //     figTree={FigTree}
//         //     onEvaluate={() => {}}
//         //     // onSave={onSave}
//         //     // isSaving={isSaving}
//         //     rootName={dataName}
//         //     collapse={1}
//         //     showArrayIndices={false}
//         //   />
//         //   {/* <JsonEditor
//         //     data={fragment}
//         //     setData={(newData) => {
//         //       setFragment(newData as EvaluatorFragment)
//         //     }}
//         //     // onSave={onSave}
//         //     isSaving={isSaving}
//         //     rootName={dataName}
//         //     collapse={2}
//         //     showArrayIndices={false}
//         //     maxWidth={650}
//         //     showSaveButton={false}
//         //     showSearch={false}
//         //     restrictAdd={({ level }) => level === 0}
//         //     restrictDelete={({ level }) => level === 1}
//         //   /> */}
//         // </Suspense>
//       }
//     </div>
//   )
// }

const getFragmentOptions = (fragments: EvaluatorFragment[] | undefined) => {
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
