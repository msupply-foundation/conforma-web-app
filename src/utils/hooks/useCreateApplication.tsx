import { ApolloError } from '@apollo/client'
import { useState } from 'react'
import { useUserState } from '../../contexts/UserState'
import { useCreateApplicationMutation } from '../../utils/generated/graphql'

export interface CreateApplicationProps {
  name: string
  templateId: number
  isConfig?: boolean
  templateResponses: { templateElementId: number; value: any }[]
}

const useCreateApplication = () => {
  const [error, setError] = useState<ApolloError | undefined>()
  const {
    userState: { currentUser },
  } = useUserState()
  const [applicationMutation] = useCreateApplicationMutation({
    onError: (error) => {
      setError(error)
    },
  })

  const createApplication = async ({
    name,
    templateId,
    templateResponses,
    isConfig = false,
  }: CreateApplicationProps) => {
    const mutationResult = await applicationMutation({
      variables: {
        isConfig,
        name,
        templateId,
        userId: currentUser?.userId,
        orgId: currentUser?.organisation?.orgId,
        sessionId: currentUser?.sessionId as string,
        responses: templateResponses,
      },
    })
    return mutationResult
  }

  return {
    error,
    create: createApplication,
  }
}

export default useCreateApplication
