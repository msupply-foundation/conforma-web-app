import React from 'react'
import { Loader, Segment } from 'semantic-ui-react'
import { SemanticSIZES } from 'semantic-ui-react'

const LoadingSmall: React.FC<{size?: SemanticSIZES}> = ({size ='small'}) => {
  return (
    <Segment basic>
      <Loader active size={size} />
    </Segment>
  )
}

export default LoadingSmall
