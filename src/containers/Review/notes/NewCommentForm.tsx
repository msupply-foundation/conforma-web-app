import React, { useState, useEffect, SyntheticEvent, useRef } from 'react'
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Icon,
  Image,
  Form,
  List,
  Header,
} from 'semantic-ui-react'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure, User } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useNotesMutations from '../../../utils/hooks/useNotesMutations'
import config from '../../../config'

const NewCommentForm: React.FC<{
  structure: FullStructure
  setShowForm: (val: boolean) => void
  refetchNotes: Function
}> = ({ structure, setShowForm, refetchNotes }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const fileInputRef = useRef<any>(null)
  const [comment, setComment] = useState<string>()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const {
    submit,
    // update,
    error: submitError,
    loadingMessage,
  } = useNotesMutations(structure.info.id)

  const handleSubmit = async () => {
    if (!comment) {
      setError('You need a comment')
      return
    }
    console.log('Submitting...')
    const result = await submit(currentUser as User, structure, comment, files)
    console.log('result', result)
    setShowForm(false)
    refetchNotes()
  }

  const handleFiles = (e: any) => {
    setFiles([...files, ...e.target.files])
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
              error={
                error
                  ? {
                      content: error,
                      // pointing: 'above',
                    }
                  : false
              }
              onChange={(e) => {
                setComment(e.target.value)
                setError('')
              }}
            />
            {files.length > 0 && <FileList files={files} setFiles={setFiles} />}
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
          <Button secondary className="wide-button" onClick={() => setShowForm(false)}>
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
