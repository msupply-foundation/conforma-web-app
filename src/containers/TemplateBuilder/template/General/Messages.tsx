import { useState } from 'react'
import { Header } from 'semantic-ui-react'
import Markdown from '../../../../utils/helpers/semanticReactMarkdown'
import { useApplicationState } from '../ApplicationWrapper'
import { useTemplateState } from '../TemplateWrapper'
import { IconButton } from '../../shared/IconButton'
import MessagesConfig from './MessagesConfig'

export const Messages = () => {
  const { structure } = useApplicationState()
  const { template } = useTemplateState()
  const { canEdit } = template
  const [isMessageConfigOpen, setIsMessageConfigOpen] = useState(false)

  return (
    <>
      <div className="template-builder-section">
        <div className="flex-row-start-center">
          <Header className="no-margin-no-padding" as="h3">
            Messages
          </Header>
          {canEdit && <IconButton name="setting" onClick={() => setIsMessageConfigOpen(true)} />}
        </div>
        <div className="flex-column-center full-width-container">
          <div className="spacer-20" />
          <Header className="no-margin-no-padding" as="h4">
            Start Message
          </Header>
          <div className="config-container-alternate text-block-width">
            <Markdown text={structure.info.startMessage || ''} />
          </div>
        </div>
        <div className="flex-column-center full-width-container">
          <div className="spacer-20" />
          <Header className="no-margin-no-padding" as="h4">
            Submission Message
          </Header>
          <div className="config-container-alternate text-block-width">
            <Markdown text={structure.info.submissionMessage || ''} />
          </div>
        </div>
      </div>
      <MessagesConfig isOpen={isMessageConfigOpen} onClose={() => setIsMessageConfigOpen(false)} />
    </>
  )
}
