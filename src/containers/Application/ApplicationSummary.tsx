import React, { useEffect, useState } from 'react'
import { FullStructure, ResponsesByCode, ElementStateNEW } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, NoMatch } from '../../components'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import { Button, Grid, Header, Message, Segment, Sticky } from 'semantic-ui-react'
import { PageElements } from '../../components/Application'

interface ApplicationProps {
  structure: FullStructure
}

const ApplicationSummary: React.FC<ApplicationProps> = ({ structure }) => {
  const { push } = useRouter()
  const { error, fullStructure } = useGetFullApplicationStructure({
    structure,
  })

  useEffect(() => {
    if (!fullStructure) return
    // Re-direct if application is not valid
    if (fullStructure.info.firstInvalidPage) {
      const sectionCode = fullStructure.info.firstInvalidPageStrict?.sectionCode
      const pageNumber = fullStructure.info.firstInvalidPageStrict?.pageNumber

      push(`/applicationNEW/${fullStructure.info.serial}/${sectionCode}/Page${pageNumber}`)
    } // Go to first invalid page
  }, [fullStructure])

  if (error) return <Message error header={strings.ERROR_APPLICATION_PAGE} list={[error]} />
  if (!fullStructure) return <Loading />
  return <Header>SUMMARY PAGE</Header>
}

export default ApplicationSummary
