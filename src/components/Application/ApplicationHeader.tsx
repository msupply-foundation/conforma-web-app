import React from 'react'
import { Header, Segment } from 'semantic-ui-react'

export interface AppHederProps {
  serialNumber: string
  name: string
  mode?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { mode, serialNumber, name } = props

  return (
    <Segment>
      <Header as="h1" content={`Application ${name}`}/>
      <Header as="h2" content={`Number ${serialNumber}`} />
      {mode && <Header as="h3" content={mode} />}
    </Segment>
  )
}

export default ApplicationHeader
