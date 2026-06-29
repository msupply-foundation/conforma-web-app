import React, { useEffect, useRef, useState } from 'react'
import { Search } from 'semantic-ui-react'
import { isEqual } from 'lodash-es'
import { ReactJson, UndoRedoSave } from './'
import {
  JsonEditorProps,
  JsonData,
  UpdateFunctionProps,
  UpdateFunction,
  UpdateResult,
} from 'json-edit-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { Loading } from '../../common'
import { useUndo } from '@json-edit-react/utils'

interface JsonEditorExtendedProps extends Omit<JsonEditorProps, 'data' | 'setData'> {
  onSave?: (data: JsonData) => void
  isSaving?: boolean
  data: JsonData
  showSaveButton?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
}

export const JsonEditor: React.FC<JsonEditorExtendedProps> = ({
  onSave = () => {},
  isSaving = false,
  data,
  showSaveButton = true,
  showSearch = true,
  searchPlaceholder,
  searchFilter,
  onUpdate,
  ...jsonViewProps
}) => {
  const { t } = useLanguageProvider()
  const [isDirty, setIsDirty] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [currentData, setCurrentData] = useState<JsonData>(data)
  const { set: setData, reset, undo, redo, canUndo, canRedo } = useUndo<JsonData>(
    currentData,
    setCurrentData
  )

  const prevDataRef = useRef(data)
  useEffect(() => {
    if (!isEqual(data, prevDataRef.current)) {
      reset(data)
      setIsDirty(false)
      prevDataRef.current = data
    }
  }, [data])

  const handleSave = async () => {
    if (currentData !== undefined) {
      await onSave(currentData)
      reset(currentData)
      setIsDirty(false)
    }
  }

  // Kept synchronous when the validator is: a synchronous rejection resolves in
  // place, so a rejected value is never committed through `setData` and never
  // enters the undo history. Only a genuinely async result is awaited.
  const handleUpdate: UpdateFunction = (updateInput: UpdateFunctionProps, control) => {
    const finalize = (result?: UpdateResult): UpdateResult => {
      let override: JsonData | undefined

      // Rejecting (`{ error }`) or cancelling (`false`/`null`) is passed
      // straight through to the editor; nothing is committed
      if (result === false || result === null) return result
      if (result && typeof result === 'object') {
        if ('error' in result && result.error !== undefined) return result
        if ('data' in result && result.data !== undefined) override = result.data
      }

      const output = override ?? updateInput.newData

      if (showSaveButton) setIsDirty(true)
      // If we don't have an explicit save button, we run "onSave" after every
      // update, but keep the Undo queue alive
      else onSave(output)

      // Only override the editor's own commit when the data was actually
      // changed; re-committing the unchanged data would record a duplicate
      // undo entry
      return override !== undefined ? { data: override } : undefined
    }

    if (!onUpdate) return finalize()

    const result = onUpdate(updateInput, control)
    return result instanceof Promise ? result.then(finalize) : finalize(result)
  }

  if (currentData === undefined) return <Loading />

  return (
    <div className="json-editor" style={{ maxWidth: jsonViewProps.maxWidth }}>
      {showSearch && (
        <Search
          size="mini"
          value={searchText}
          open={false}
          placeholder={searchPlaceholder ?? t('JSON_EDIT_SEARCH_PLACEHOLDER')}
          onSearchChange={(_, { value = '' }) => setSearchText(value)}
          style={{ marginBottom: '0.5em', alignSelf: 'flex-end' }}
        />
      )}
      <ReactJson
        data={currentData}
        setData={setData as (value: JsonData) => void}
        onUpdate={handleUpdate}
        theme={{
          container: {
            backgroundColor: '#fefefe',
            marginBottom: '1em',
          },
        }}
        searchFilter={searchFilter ?? 'key'}
        searchText={searchText}
        {...jsonViewProps}
      />
      {showSaveButton && (
        <UndoRedoSave
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          isDirty={isDirty}
          isSaving={isSaving}
          handleSave={handleSave}
        />
      )}
    </div>
  )
}

//

export default JsonEditor
