import React, { useEffect } from 'react'
import { Container, Header } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { FullStructure } from '../../../utils/types'
import { TimelineStageUI } from './TimelineStage'
import { Overview } from './Overview'
import useTimeline from '../../../utils/hooks/useTimeline'

const OverviewTab: React.FC<{
  structure: FullStructure
  isActive: boolean
}> = ({ structure: fullStructure, isActive }) => {
  const { strings } = useLanguageProvider()
  const { timeline, loading, error, refreshTimeline } = useTimeline(fullStructure)

  const currentStageNum = fullStructure.info.current.stage.number

  useEffect(() => {
    if (isActive) refreshTimeline()
  }, [isActive])

  return (
    <Container id="overview-tab">
      {loading && <Loading />}
      {timeline && <Overview structure={fullStructure} activityLog={timeline.rawLog} />}
      <div id="timeline">
        <Header as="h2" textAlign="center">
          {strings.REVIEW_OVERVIEW_ACTIVITY}
        </Header>
        {timeline &&
          timeline.stages.map((stage) => (
            <TimelineStageUI
              key={stage.name}
              stage={stage}
              isCurrentStage={stage.number === currentStageNum}
            />
          ))}
      </div>
    </Container>
  )
}

export default OverviewTab
