import React, { useEffect } from 'react'
import { FullStructure } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'

interface ApplicationProps {
  structure: FullStructure
}

const ApplicationPage: React.FC<ApplicationProps> = ({ structure }) => {
  const { error, isLoading, fullStructure, responsesByCode } = useGetFullApplicationStructure(
    structure
  )

  const {
    push,
    match: { path },
  } = useRouter()

  console.log('Structure', fullStructure)

  useEffect(() => {
    if (!structure) return

    console.log('Structure', fullStructure)

    // Re-direct based on application status and progress
    if (structure.info.current?.status === ApplicationStatus.ChangesRequired)
      push(`/application/${structure.info.serial}`)
    // if (structure.info.current?.status !== ApplicationStatus.Draft)
    //   push(`/application/${structure.info.serial}/summary`)

    // TO-DO: Redirect based on Progress (wait till Progress calculation is done)
  }, [structure])

  return <p>IN PROGRESS PAGE</p>
}

export default ApplicationPage
