import React from 'react'
import { Header, Container } from 'semantic-ui-react'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import strings from '../../utils/constants'

interface ApplicationHomeWrapperProps {
  startMessage?: string
  name: string
  title: string
  subtitle?: string
  ButtonSegment?: React.FC
}

const ApplicationHomeWrapper: React.FC<ApplicationHomeWrapperProps> = ({
  startMessage,
  name,
  title,
  subtitle,
  ButtonSegment,
  children,
}) => {
  return (
    <>
      <Container id="application-home-content">
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader as="h3" content={title} />
        </Header>
        {subtitle && <p>{subtitle}</p>}
        <Header as="h4" className="steps-header" content={strings.TITLE_STEPS} />
        {children}
        {startMessage && <Markdown text={startMessage || ''} semanticComponent="Message" info />}
        {ButtonSegment && <ButtonSegment />}
      </Container>
    </>
  )
}

export default ApplicationHomeWrapper
