import React, { useEffect, useState } from 'react'
import { Search } from 'semantic-ui-react'
<<<<<<< Updated upstream
import {
  JsonEditor as ReactJson,
  JsonEditorProps,
  JsonData,
  UpdateFunctionProps,
  UpdateFunction,
} from 'json-edit-react'
=======
import { JsonEditor as ReactJson, JsonEditorProps, JsonData } from 'json-edit-react'
import { useToast, topLeft } from '../../../contexts/Toast'
>>>>>>> Stashed changes
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast, topLeft } from '../../../contexts/Toast'
import { Loading } from '../../common'
import useUndo from 'use-undo'
import { handleCopyToClipboard } from './utils'
import { UndoRedoSave } from './UndoRedoSave'

interface JsonEditorExtendedProps extends Omit<JsonEditorProps, 'data'> {
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
  const [{ present: currentData }, { set: setData, reset, undo, redo, canUndo, canRedo }] =
    useUndo(data)
  const { showToast } = useToast({ position: topLeft })

  useEffect(() => {
    reset(data)
    setIsDirty(false)
  }, [data])

  const handleSave = async () => {
    if (currentData !== undefined) {
      await onSave(currentData)
      reset(currentData)
      setIsDirty(false)
    }
  }

  const handleUpdate: UpdateFunction = async (updateInput: UpdateFunctionProps) => {
    if (onUpdate) {
      const result = await onUpdate(updateInput)
      if (typeof result === 'string' || result === false) return result
      if (Array.isArray(result) && result[0] === 'error') return result
      const output =
        Array.isArray(result) && result[0] === 'value' ? result[1] : updateInput.newData

      if (showSaveButton) setIsDirty(true)
      // If we don't have an explicit save button, we run "onSave" after every
      // update, but keep the Undo queue alive
      else await onSave(output)

      return ['value', output]
    }
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
        enableClipboard={(input) => handleCopyToClipboard(input, t, showToast)}
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
