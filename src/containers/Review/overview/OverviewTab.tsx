import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { TimelineStageUI } from './TimelineStage'
import { Overview } from './Overview'
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
      {loading && <p>Loading...</p>}
      {timeline && <Overview structure={fullStructure} activityLog={timeline.rawLog} />}
      <div id="timeline">
        {timeline && timeline.stages.map((stage) => <TimelineStageUI stage={stage} />)}
      </div>
    </Container>
  )
}

export default OverviewTab
