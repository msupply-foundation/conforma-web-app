import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Dropdown, Icon, Image, Form } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { ApplicationNote, useGetApplicationNotesQuery } from '../../../utils/generated/graphql'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { DateTime } from 'luxon'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'
import NewCommentForm from './NewCommentForm'
import config from '../../../config'

const downloadUrl = `${config.serverREST}/public`

interface FileData {
  filePath: string
  description: string | null
  id: number
  originalFilename: string
  uniqueId: string
}

const NotesTab: React.FC<{
  structure: FullStructure
  state: {
    sortDesc: boolean
    setSortDesc: Function
    filesOnlyFilter: boolean
    setFilesOnlyFilter: Function
  }
}> = ({
  structure: fullStructure,
  state: { sortDesc, setSortDesc, filesOnlyFilter, setFilesOnlyFilter },
}) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const [newNote, setNewNote] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [showForm, setShowForm] = useState(false)

  const { data, loading, error } = useGetApplicationNotesQuery({
    variables: { applicationId: fullStructure.info.id },
    // fetchPolicy: 'network-only',
  })

  if (error) return <p>{error.message}</p>
  if (loading) return <Loading />

  const notes: ApplicationNote[] = sortAndFilter(
    data?.applicationNotes?.nodes as ApplicationNote[],
    sortDesc,
    filesOnlyFilter
  )

  return notes ? (
    <Container id="notes-tab">
      <div className="options-row">
        <p>Sort order:</p>
        <Dropdown
          selection
          options={[
            { key: 'newest', text: 'Newest first', value: true },
            { key: 'oldest', text: 'Oldest first', value: false },
          ]}
          value={sortDesc}
          onChange={(_, { value }) => setSortDesc(value as boolean)}
        />
        <p>Files only:</p>
        <Checkbox
          toggle
          checked={filesOnlyFilter}
          onChange={(_, { checked }) => setFilesOnlyFilter(checked as boolean)}
        />
      </div>

      {notes.map((note) => {
        const isCurrentUser = note?.user?.id === currentUser?.userId
        return (
          <div className={`note-container${isCurrentUser ? ' highlight-background' : ''}`}>
            <div className="note-comment-row">
              <div className="comment">
                <Markdown text={note.comment} />
              </div>
              <Icon
                className="clickable"
                name="edit"
                size="large"
                color="blue"
                onClick={() => alert('Not implemented yet')}
                style={{ visibility: isCurrentUser ? 'visible' : 'hidden' }}
              />
            </div>
            <FilesDisplay files={note.files.nodes as FileData[]} />
            <div className="note-footer-row">
              <p className="tiny-bit-smaller-text">
                <strong>{note.user?.fullName}</strong>
              </p>
              <p className="slightly-smaller-text dark-grey">
                {DateTime.fromISO(note.timestamp).toLocaleString(DateTime.DATETIME_MED)}
              </p>
            </div>
          </div>
        )
      })}
      <Form.Field>
        <Button
          primary
          className="wide-button"
          onClick={() => setShowForm(true)}
          content={strings.REVIEW_NOTES_NEW_COMMENT}
        />
      </Form.Field>
      {showForm && <NewCommentForm structure={fullStructure} />}
    </Container>
  ) : null
}

export default NotesTab

const FilesDisplay: React.FC<any> = ({ files }) => {
  if (files.length === 0) return null

  return (
    <div className="file-row">
      {files.map((file: FileData) => (
        <div className="file-container">
          <a href={`${downloadUrl}/file?uid=${file?.uniqueId}`} target="_blank">
            <Image src={`${downloadUrl}/file?uid=${file?.uniqueId}&thumbnail=true`} />
          </a>
          <a href={`${downloadUrl}/file?uid=${file?.uniqueId}`} target="_blank">
            {file.originalFilename}
          </a>
        </div>
      ))}
    </div>
  )
}

const sortAndFilter = (
  notes: ApplicationNote[],
  sortDesc: boolean,
  filesOnly: boolean
): ApplicationNote[] => {
  const sort = sortDesc ? (e: ApplicationNote[]) => e : (e: ApplicationNote[]) => [...e].reverse()
  const fileFilter = filesOnly
    ? (e: ApplicationNote[]) => e.filter((note) => note.files.nodes.length > 1)
    : (e: ApplicationNote[]) => e
  return fileFilter(sort(notes))
}
