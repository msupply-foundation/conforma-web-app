import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export interface AppHederProps {
  serialNumber: string
  name: string
  mode?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { mode, serialNumber, name } = props

  return (
    <Container text>
      <Header as="h1" content={`${name} Number ${serialNumber}`} />
      {mode && <Header as="h2" content={mode} />}
    </Container>
  )
}

export default ApplicationHeader
