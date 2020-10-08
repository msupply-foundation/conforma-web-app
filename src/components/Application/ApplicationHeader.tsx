import React from 'react'
import { Card } from 'semantic-ui-react'

export interface AppHederProps {
  serialNumber: string
  name: string
  mode?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { mode, serialNumber, name } = props

  return (
    <Card>
      <Card.Content header={`${name} Number ${serialNumber}`} />
      {mode && <Card.Content meta={mode} />}
      <Card.Content description={`HOME page of the Application`} />
    </Card>
  )
}

export default ApplicationHeader
