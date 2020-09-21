import React from 'react'
import { Icon, Segment } from 'semantic-ui-react'

const NoMatch: React.FC = () => {
  return (
    <Segment>
      <Icon name="minus circle" size="big" />
      <strong>Page not found!</strong>
    </Segment>
  )
}

export default NoMatch
