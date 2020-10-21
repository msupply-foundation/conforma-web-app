import React from 'react'
import { Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import { TemplateElement } from '../../utils/generated/graphql'

interface ApplicationQuestionProps {
  templateElement: TemplateElement
}

const ApplicationQuestion: React.FC<ApplicationQuestionProps> = ({ templateElement }) => {
  const { code } = templateElement
  console.log(`TemplateElement ${code}`, templateElement)

  return (
    <Segment>
      <h1>Test</h1>
      <ApplicationViewWrapper
        key={`question_${code}`}
        initialValue={'Test'}
        templateElement={templateElement}
        onUpdate={() => console.log('onUpdate called')}
        isVisible={true}
        isEditable={true}
      />
    </Segment>
  )
}

export default ApplicationQuestion
