import React from 'react'
import { Header, Container } from 'semantic-ui-react'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import strings from '../../utils/constants'

interface ApplicationHomeWrapperProps {
  startMessage?: string
  name: string
}

const ApplicationHomeWrapper: React.FC<ApplicationHomeWrapperProps> = ({
  startMessage,
  name,
  children,
}) => {
  return (
    <>
      <Container id="application-content" className="application-home-width">
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader content={<Header as="h3" content={strings.TITLE_INTRODUCTION} />} />
        </Header>
        <p>{strings.SUBTITLE_APPLICATION_STEPS}</p>
        <Header as="h4" className="steps-header" content={strings.TITLE_STEPS} />
        {startMessage && <Markdown text={startMessage || ''} semanticComponent="Message" info />}
        {children}
      </Container>
    </>
  )
}

export default ApplicationHomeWrapper
