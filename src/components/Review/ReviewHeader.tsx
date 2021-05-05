import React, { CSSProperties } from 'react'
import { Container, Header } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { User } from '../../utils/types'
import Stage from './Stage'

export interface ReviewHeaderProps {
  applicationStage: string
  applicationStageColour: string
  applicationName: string
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  applicationStage,
  applicationStageColour,
  applicationName,
}) => {
  return (
    <Container>
      <div style={inlineStyles.container}>
        <Stage name={applicationStage} colour={applicationStageColour} />
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
    </Container>
  )
}

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

export default ReviewHeader
