import { useState } from 'react'
import {
  ApplicationResponseStatus,
  TemplateElementCategory,
  useCreateNoteMutation,
} from '../generated/graphql'
import { postRequest } from '../../utils/helpers/fetchMethods'
import { FullStructure, UseGetApplicationProps, User } from '../types'
import config from '../../config'

const fileEndpoint = `${config.serverREST}${config.uploadEndpoint}`

const useNotesMutations = (applicationId: number) => {
  const [error, setError] = useState<string>()
  const [loadingMessage, setLoadingMessage] = useState('')

  const [applicationSubmitMutation] = useCreateNoteMutation({
    onError: (submissionError) => setError(submissionError.message),
  })

  const submit = async (user: User, structure: FullStructure, comment: string, files: File[]) => {
    const { userId, organisation } = user
    const {
      info: { serial, id: applicationId },
    } = structure
    setLoadingMessage('Creating note...')
    // First create the note
    const mutationResult = await applicationSubmitMutation({
      variables: {
        applicationId,
        userId,
        orgId: organisation?.orgId,
        comment,
      },
    })
    if (mutationResult.errors) throw new Error(mutationResult.errors.toString())
    // Then upload the files with Post request
    setLoadingMessage('Uploading files...')
    const noteId = mutationResult.data?.createApplicationNote?.applicationNote?.id

    const fileData = new FormData()
    files.forEach((file) => fileData.append('file', file))
    const fileResult = await postRequest({
      url: `${fileEndpoint}?user_id=${userId}&application_serial=${serial}&application_note_id=${noteId}`,
      otherBody: fileData,
    })

    setLoadingMessage('')
    // Then force refetch
    return { mutationResult, fileResult }
  }

  return {
    error,
    loadingMessage,
    submit,
  }
}

export default useNotesMutations
