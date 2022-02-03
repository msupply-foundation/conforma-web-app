import React, { useState, useEffect, SyntheticEvent, useRef } from 'react'
import { Button, Checkbox, Container, Dropdown, Icon, Image, Form, List } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { ApplicationNote, useGetApplicationNotesQuery } from '../../../utils/generated/graphql'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure, User } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useNotesMutations from '../../../utils/hooks/useNotesMutations'
import config from '../../../config'

const downloadUrl = `${config.serverREST}/public`

const NewCommentForm: React.FC<{
  structure: FullStructure
  setShowForm: (val: boolean) => void
  refetch: Function
}> = ({ structure, setShowForm, refetch }) => {
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
    setShowForm(false)
    const result = await submit(currentUser as User, structure, comment, files)
    console.log('result', result)
    refetch()

    // Insert comment, return ID
    // Upload files with comment ID
    // Refetch notes (if required)
  }

  const handleFiles = (e: any) => {
    setFiles([...files, ...e.target.files])
  }

  console.log('Loading', loadingMessage)

  return (
    <Form id="new-comment-form" onSubmit={handleSubmit}>
      <Form.Field>
        <label>
          Enter comment (
          <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">
            Markdown
          </a>{' '}
          formatting is supported)
        </label>
        <Form.TextArea
          rows={6}
          error={
            error
              ? {
                  content: error,
                  pointing: 'above',
                }
              : false
          }
          onChange={(e) => {
            setComment(e.target.value)
            setError('')
          }}
        />
      </Form.Field>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        name="file-upload"
        multiple={true}
        onChange={handleFiles}
      />
      <p className="clickable">
        <a onClick={() => fileInputRef?.current?.click()}>+ Add files</a>
      </p>
      <List>
        {files.map((file) => (
          <List.Item>{file.name}</List.Item>
        ))}
      </List>
      <Button type="submit" primary className="wide-button">
        Submit
      </Button>
      <Button secondary className="wide-button" onClick={() => setShowForm(false)}>
        Cancel
      </Button>
    </Form>
  )
}

export default NewCommentForm
