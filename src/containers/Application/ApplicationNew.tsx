import React from 'react'
import { Button, Label, Segment } from 'semantic-ui-react'
import { useNavigationState } from '../Main/NavigationState'
import { useTemplateState } from './TemplateState'

const ApplicationNew: React.FC = () => {
  const { navigationState, setNavigationState } = useNavigationState()
  const { type } = navigationState.queryParameters
  const { templateState, setTemplateState } = useTemplateState()
  const { type: tempalteType } = templateState

  return (
    <Segment content="THIS IS THE APPLICATION NEW AREA">
      {tempalteType && <Button content={tempalteType.name} />}
      {!tempalteType && <Label content="No Application" />}
    </Segment>
  )
}

export default ApplicationNew
