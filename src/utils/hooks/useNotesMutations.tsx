import { useState } from 'react'
import { useCreateNoteMutation, useDeleteNoteMutation } from '../generated/graphql'
import { postRequest } from '../../utils/helpers/fetchMethods'
import { FullStructure, User } from '../types'
import { useLanguageProvider } from '../../contexts/Localisation'
import getServerUrl from '../helpers/endpoints/endpointUrlBuilder'

const useNotesMutations = (_: number, refetchNotes: Function) => {
  const { t } = useLanguageProvider()
  const [error, setError] = useState<string>()
  const [loadingMessage, setLoadingMessage] = useState('')

  const [createNoteMutation] = useCreateNoteMutation({
    onError: (submissionError) => setError(submissionError.message),
  })

  const [deleteNoteMutation] = useDeleteNoteMutation({
    onError: (submissionError) => setError(submissionError.message),
  })

  const submit = async (user: User, structure: FullStructure, comment: string, files: File[]) => {
    const { userId, organisation } = user
    const {
      info: { serial, id: applicationId },
    } = structure
    setLoadingMessage(t('REVIEW_NOTES_SUBMIT_MSG'))
    // First create the note
    const mutationResult = await createNoteMutation({
      variables: {
        applicationId,
        userId,
        orgId: organisation?.orgId,
        comment,
      },
    })
    if (mutationResult?.errors) {
      setError(t('REVIEW_NOTES_MUTATION_ERROR'))
      console.log(mutationResult?.errors)
      return
    }

    // Then upload the files with Post request
    const noteId = mutationResult.data?.createApplicationNote?.applicationNote?.id

    if (files.length > 0) setLoadingMessage(t('REVIEW_NOTES_UPLOADING_MSG'))

    const fileResults: any = []
    files.forEach((file) => {
      // Should be able to do this in a single POST request, but doesn't work
      // reliably with multiple files
      const fileData = new FormData()
      fileData.append('file', file)
      fileResults.push(
        postRequest({
          url: getServerUrl('upload', {
            userId,
            applicationSerial: serial,
            applicationNoteId: noteId,
          }),
          otherBody: fileData,
        })
      )
    })
    await Promise.all(fileResults)
    setLoadingMessage('')

    // Then force refetch to update UI
    refetchNotes()
    return { mutationResult, fileResults }
  }

  const deleteNote = async (noteId: number) => {
    setLoadingMessage(t('REVIEW_NOTES_DELETING_MSG'))
    const mutationResult = await deleteNoteMutation({
      variables: {
        noteId,
      },
    })
    if (mutationResult?.errors) {
      setError(t('REVIEW_NOTES_MUTATION_ERROR'))
      console.log(mutationResult.errors)
    }
    // We don't need to delete file records, as they'll be deleted automatically
    // due to foreign key references in file table, and back-end is triggered to
    // handle deleting the actual files
    setLoadingMessage('')
  }

  return {
    error,
    loadingMessage,
    submit,
    deleteNote,
  }
}

export default useNotesMutations
