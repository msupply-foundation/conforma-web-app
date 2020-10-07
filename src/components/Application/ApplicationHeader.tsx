import React from 'react'
import { Card } from 'semantic-ui-react'

export interface AppHederProps {
  mode?: string
  serial: number
  name: string
  sectionName?: string
  page?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { mode, serial, name, sectionName, page } = props

  return (
    <Card>
      <Card.Content header={`${name} Number ${serial}`} />
      {mode && <Card.Content meta={mode} />}
      {sectionName && page ? (
        <Card.Content description={`PAGE ${page} of SECTION ${sectionName}`} />
      ) : (
        <Card.Content description={`HOME page of the Application`} />
      )}
    </Card>
  )
}

export default ApplicationHeader
