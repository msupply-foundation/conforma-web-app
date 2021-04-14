import React, { CSSProperties } from 'react'
import { Container, Header, Label } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { User } from '../../utils/types'

export interface ReviewHeaderProps {
  applicationStage: string
  applicationName: string
  currentUser: User | null
  ChildComponent: React.FC
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  applicationStage,
  applicationName,
  currentUser,
  ChildComponent,
}) => {
  return (
    <Container>
      <div style={inlineStyles.container}>
        <StageComponent stage={applicationStage} />
      </div>
      <Header
        textAlign="center"
        style={inlineStyles.date}
        content={applicationName}
        subheader={strings.DATE_APPLICATION_PLACEHOLDER}
      />
      <Header
        as="h1"
        textAlign="center"
        style={inlineStyles.title}
        content={strings.LABEL_REVIEW.toUpperCase()}
      />
      <Header
        textAlign="center"
        style={inlineStyles.subtitle}
        as="h3"
        content={strings.SUBTITLE_REVIEW}
      />
      <ChildComponent />
    </Container>
  )
}

const StageComponent: React.FC<{ stage: string }> = ({ stage }) => (
  // TODO: Issue #561 - Setup to use pre-defined colour of stage label
  <Label style={tempStageStyle(stage)}>{stage}</Label>
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  container: { textAlign: 'center' } as CSSProperties,
  date: { margin: 3, padding: 5 } as CSSProperties,
  title: {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 5,
  } as CSSProperties,
  subtitle: { marginTop: 4, color: '#4A4A4A', fontSize: 16, letterSpacing: 0.36 } as CSSProperties,
}

const tempStageStyle = (stage: string) => {
  return stage === 'Assessment'
    ? {
        color: 'white',
        background: 'rgb(86, 180, 219)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.81px',
      }
    : {
        color: 'white',
        background: 'rgb(225, 126, 72)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.81px',
      }
}

export default ReviewHeader
