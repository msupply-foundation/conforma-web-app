import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { FullStructure } from '../../../utils/types'
import { TimelineStageUI } from './TimelineStage'
import { Overview } from './Overview'
import useTimeline from '../../../utils/hooks/useTimeline'

const OverviewTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { timeline, loading, error } = useTimeline(fullStructure.info.id)

  return (
    <Container id="overview-tab">
      {loading && <Loading />}
      {timeline && <Overview structure={fullStructure} activityLog={timeline.rawLog} />}
      <div id="timeline">
        <Header as="h2" textAlign="center">
          Activity
        </Header>
        {timeline && timeline.stages.map((stage) => <TimelineStageUI stage={stage} />)}
      </div>
    </Container>
  )
}

export default OverviewTab
