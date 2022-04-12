import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Icon,
  Image,
  Form,
  Message,
} from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { ApplicationNote, useGetApplicationNotesQuery } from '../../../utils/generated/graphql'
import ModalWarning from '../../../components/Main/ModalWarning'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { DateTime, Interval } from 'luxon'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'
import NewCommentForm from './NewCommentForm'
import useNotesMutations from '../../../utils/hooks/useNotesMutations'
import config from '../../../config'

const COMMENT_DELETION_LIMIT = 5 // minutes

const downloadUrl = `${config.serverREST}/public`

interface FileData {
  filePath: string
  description: string | null
  id: number
  originalFilename: string
  uniqueId: string
}

export interface NotesState {
  sortDesc: boolean
  filesOnlyFilter: boolean
  showForm: boolean
  files: File[]
  comment: string
}

const NotesTab: React.FC<{
  structure: FullStructure
  state: NotesState
  setState: (state: NotesState) => void
}> = ({ structure: fullStructure, state, setState }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const [modalOpen, setModalOpen] = useState(false)
  const [noteIdToDelete, setNoteIdToDelete] = useState<number>(0)

  const { data, loading, error, refetch } = useGetApplicationNotesQuery({
    variables: { applicationId: fullStructure.info.id },
    // fetchPolicy: 'network-only',
  })
  const { deleteNote, error: noteMutationError } = useNotesMutations(fullStructure.info.id, refetch)

  const { sortDesc, filesOnlyFilter, showForm } = state

  const handleDelete = async () => {
    await deleteNote(noteIdToDelete)
    setModalOpen(false)
    setNoteIdToDelete(0)
    refetch()
  }

  if (error) return <p>{error.message}</p>
  if (loading) return <Loading />

  const notes: ApplicationNote[] = sortAndFilter(
    data?.applicationNotes?.nodes as ApplicationNote[],
    sortDesc,
    filesOnlyFilter
  )

  return notes ? (
    <Container id="notes-tab">
      <ModalWarning
        title={strings.REVIEW_NOTES_DELETE_TITLE}
        message={strings.REVIEW_NOTES_DELETE_MESSAGE}
        option={strings.BUTTON_CONFIRM}
        open={modalOpen}
        onClick={() => handleDelete()}
        onClose={() => setModalOpen(false)}
      />
      <div className="options-row">
        <p>{strings.REVIEW_NOTES_SORT_ORDER}</p>
        <Dropdown
          selection
          options={[
            { key: 'newest', text: strings.REVIEW_NOTES_NEWEST_FIRST, value: true },
            { key: 'oldest', text: strings.REVIEW_NOTES_OLDEST_FIRST, value: false },
          ]}
          value={sortDesc}
          onChange={(_, { value }) => setState({ ...state, sortDesc: value as boolean })}
        />
        <p>{strings.REVIEW_NOTES_FILES_ONLY}</p>
        <Checkbox
          toggle
          checked={filesOnlyFilter}
          onChange={(_, { checked }) => setState({ ...state, filesOnlyFilter: checked as boolean })}
        />
      </div>
      {noteMutationError && <Message error content={noteMutationError} />}
      <div className="wrapper">
        {notes.length > 0 ? (
          notes.map((note) => {
            const isCurrentUser = note?.user?.id === currentUser?.userId
            return (
              <div
                key={note.id}
                className={`note-container item-container${
                  isCurrentUser ? ' highlight-background' : ''
                }`}
              >
                <div className="note-comment-row">
                  <div className="comment">
                    <Markdown text={note.comment} />
                  </div>
                  <Icon
                    className="clickable"
                    name="delete"
                    size="large"
                    color="blue"
                    onClick={() => {
                      setNoteIdToDelete(note.id)
                      setModalOpen(true)
                    }}
                    style={{
                      visibility: isCurrentUser && canDelete(note.timestamp) ? 'visible' : 'hidden',
                    }}
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
          })
        ) : (
          <Message header={strings.REVIEW_NOTES_NO_NOTES} />
        )}
        {!showForm && (
          <div className="item-container">
            <Form.Field>
              <Button
                primary
                inverted
                className="wide-button"
                onClick={() => setState({ ...state, showForm: true })}
              >
                <Icon name="plus" size="tiny" color="blue" />
                {strings.REVIEW_NOTES_NEW_NOTE}
              </Button>
            </Form.Field>
          </div>
        )}
      </div>
      {showForm && (
        <NewCommentForm
          structure={fullStructure}
          state={state}
          setState={setState}
          refetchNotes={refetch}
        />
      )}
    </Container>
  ) : null
}

export default NotesTab

const FilesDisplay: React.FC<any> = ({ files }) => {
  if (files.length === 0) return null

  return (
    <div className="file-row">
      {files.map((file: FileData) => (
        <div className="file-container" key={file.uniqueId}>
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
    ? (e: ApplicationNote[]) => e.filter((note) => note.files.nodes.length > 0)
    : (e: ApplicationNote[]) => e
  return fileFilter(sort(notes))
}

const canDelete = (timestamp: string): boolean => {
  // This is pretty insecure -- all someone needs to do is change their local
  // time on their computer and they can delete whatever they want!
  return (
    Interval.fromDateTimes(DateTime.fromISO(timestamp), DateTime.now()).length('minutes') <
    COMMENT_DELETION_LIMIT
  )
}
