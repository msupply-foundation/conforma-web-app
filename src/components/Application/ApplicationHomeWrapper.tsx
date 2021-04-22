import React from 'react'
import { Header } from 'semantic-ui-react'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import strings from '../../utils/constants'

interface ApplicationHomeWrapperProps {
  startMessage?: string
}

const ApplicationHomeWrapper: React.FC<ApplicationHomeWrapperProps> = ({
  startMessage,
  children,
}) => {
  return (
    <>
      <p>{strings.SUBTITLE_APPLICATION_STEPS}</p>
      <Header as="h4" className="steps-header" content={strings.TITLE_STEPS} />
      {children}
      {startMessage && <Markdown text={startMessage || ''} semanticComponent="Message" info />}
    </>
  )
}

export default ApplicationHomeWrapper
