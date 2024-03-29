import React, { useState, useRef } from 'react'
import { Button, Form, List, Header, Message, Icon } from 'semantic-ui-react'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure, User } from '../../../utils/types'
import reactStringReplace from 'react-string-replace'
import { TranslateMethod, useLanguageProvider } from '../../../contexts/Localisation'
import useNotesMutations from '../../../utils/hooks/useNotesMutations'
import { NotesState } from './NotesTab'
import { SimpleCacheReturn } from '../../../utils/hooks/useSimpleCache'

const NewCommentForm: React.FC<{
  structure: FullStructure
  state: NotesState
  setState: (state: NotesState) => void
  refetchNotes: Function
  fileCache: SimpleCacheReturn<File>
}> = ({ structure, state, setState, refetchNotes, fileCache }) => {
  const { t } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const fileInputRef = useRef<any>(null)
  const { files, comment } = state
  const [error, setError] = useState('')
  const {
    submit,
    error: noteMutationError,
    loadingMessage,
  } = useNotesMutations(structure.info.id, refetchNotes)

  const handleSubmit = async () => {
    if (!comment) {
      setError(t('REVIEW_NOTES_COMMENT_ERROR'))
      return
    }
    await submit(currentUser as User, structure, comment, files)
    setState({ ...state, showForm: false, comment: '', files: [] })
    files.forEach((file) => fileCache.addToCache(file.name, file))
  }

  const handleFiles = (e: any) => {
    setState({ ...state, files: [...files, ...e.target.files] })
  }

  return (
    <div id="new-comment-form" className="wrapper">
      {noteMutationError && <Message error content={noteMutationError} />}
      <Form onSubmit={handleSubmit} className="item-container">
        <Form.Field>
          <label>
            {t('REVIEW_NOTES_ENTER_COMMENT')}{' '}
            {reactStringReplace(
              t('REVIEW_NOTES_MARKDOWN_SUPPORT'),
              t('MARKDOWN'),
              (match, index) => (
                <a href={t('MARKDOWN_LINK')} target="_blank" key={index}>
                  {match}
                </a>
              )
            )}
          </label>
        </Form.Field>
        <Form.Field>
          <div className="textarea-row" style={{ gap: 15 }}>
            <Form.TextArea
              rows={6}
              value={comment}
              error={error ? error : false}
              onChange={(e) => {
                setState({ ...state, comment: e.target.value })
                setError('')
              }}
            />
            {files.length > 0 && (
              <FileList
                files={files}
                setFiles={(files: File[]) => setState({ ...state, files })}
                t={t}
              />
            )}
          </div>
        </Form.Field>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          name="file-upload"
          multiple={true}
          onChange={handleFiles}
        />
        <p className="clickable slightly-smaller-text">
          <a onClick={() => fileInputRef?.current?.click()}>{`+ ${t('REVIEW_NOTES_ADD_FILES')}`}</a>
        </p>
        <div className="file-row">
          <Button loading={!!loadingMessage} type="submit" primary className="wide-button">
            {t('BUTTON_SUBMIT')}
          </Button>
          <Button
            secondary
            className="wide-button"
            onClick={() => setState({ ...state, showForm: false, comment: '', files: [] })}
          >
            {t('OPTION_CANCEL')}
          </Button>
          <p className="smaller-text">
            <em>{loadingMessage}</em>
          </p>
        </div>
      </Form>
    </div>
  )
}

const FileList: React.FC<{ files: File[]; setFiles: Function; t: TranslateMethod }> = ({
  files,
  setFiles,
  t,
}) => (
  <div id="files-list">
    <Header as="h4">{t('REVIEW_NOTES_FILES')}</Header>
    <p className="smaller-text" style={{ marginBottom: '0.5em' }}>
      {t('REVIEW_NOTES_HOVER_TO_REMOVE')}
    </p>
    <List bulleted>
      {files.map((file) => (
        <List.Item key={file.name}>
          <div
            className="text-ellipsis icon-after tiny-bit-smaller-text"
            style={{ paddingBottom: 1 }}
          >
            {file.name}
            <Icon
              circular
              name="close"
              color="blue"
              size="small"
              className="floating-icon clickable"
              onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
            />
          </div>
        </List.Item>
      ))}
    </List>
  </div>
)

export default NewCommentForm
