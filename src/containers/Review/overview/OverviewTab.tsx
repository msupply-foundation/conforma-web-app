import React, { useState, useEffect } from 'react'
import { Container, Message } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useTimeline from '../../../utils/hooks/useTimeline'

const OverviewTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()
  const { timeline, loading, error } = useTimeline(fullStructure.info.id)

  return (
    <Container id="overview-tab">
      <Message>
        <Message.Header>Placeholder for OVERVIEW tab</Message.Header>
      </Message>
      {loading && <p>Loading...</p>}
      {timeline && <pre>{JSON.stringify(timeline, null, 2)}</pre>}
    </Container>
  )
}

export default OverviewTab
