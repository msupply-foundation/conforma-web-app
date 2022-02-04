import React, { useState, useRef } from 'react'
import { Button, Form, List, Header } from 'semantic-ui-react'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure, User } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useNotesMutations from '../../../utils/hooks/useNotesMutations'
import { NotesState } from './NotesTab'

const NewCommentForm: React.FC<{
  structure: FullStructure
  state: NotesState
  setState: (state: NotesState) => void
  refetchNotes: Function
}> = ({ structure, state, setState, refetchNotes }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const fileInputRef = useRef<any>(null)
  const { files, comment } = state
  const [error, setError] = useState('')
  const { submit, error: submitError, loadingMessage } = useNotesMutations(structure.info.id)

  const handleSubmit = async () => {
    if (!comment) {
      setError('You need a comment')
      return
    }
    console.log('Submitting...')
    const result = await submit(currentUser as User, structure, comment, files)
    console.log('result', result)
    setState({ ...state, showForm: false })
    refetchNotes()
  }

  const handleFiles = (e: any) => {
    setState({ ...state, files: [...files, ...e.target.files] })
  }

  console.log('Loading', loadingMessage)

  return (
    <div id="new-comment-form" className="wrapper">
      <Form onSubmit={handleSubmit} className="item-container">
        <Form.Field>
          <label>
            Enter comment (
            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
              Markdown
            </a>{' '}
            formatting is supported)
          </label>
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
              <FileList files={files} setFiles={(files: File[]) => setState({ ...state, files })} />
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
          <a onClick={() => fileInputRef?.current?.click()}>+ Add files</a>
        </p>
        <div className="file-row">
          <Button loading={!!loadingMessage} type="submit" primary className="wide-button">
            Submit
          </Button>
          <Button
            secondary
            className="wide-button"
            onClick={() => setState({ ...state, showForm: false })}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

const FileList: React.FC<{ files: File[]; setFiles: Function }> = ({ files, setFiles }) => (
  <div id="files-list">
    <Header as="h4">Files</Header>
    <p className="smaller-text">(Click to remove)</p>
    <List bulleted>
      {files.map((file) => (
        <List.Item
          key={file.name}
          onClick={() => setFiles(files.filter((f) => f.name !== file.name))}
        >
          <a>{file.name}</a>
        </List.Item>
      ))}
    </List>
  </div>
)

export default NewCommentForm
