import React, { CSSProperties } from 'react'
import { Container, Header, Label } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { User } from '../../utils/types'
import Stage from './Stage'

export interface ReviewHeaderProps {
  applicationStage: string
  applicationStageColour: string
  applicationName: string
  currentUser: User | null
  ChildComponent: React.FC
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  applicationStage,
  applicationStageColour,
  applicationName,
  currentUser,
  ChildComponent,
}) => {
  return (
    <Container id="application-summary">
      <Stage name={applicationStage} colour={applicationStageColour} />
      <div id="application-summary-header">
        <Header as="h2" textAlign="center">
          <strong>{applicationName}</strong>
          <Header.Subheader>{strings.DATE_APPLICATION_PLACEHOLDER}</Header.Subheader>
        </Header>
        <Header as="h2" textAlign="center" content={strings.LABEL_REVIEW} />
        <p>{strings.SUBTITLE_REVIEW}</p>
      </div>
      <ChildComponent />
    </Container>
  )
}

export default ReviewHeader
