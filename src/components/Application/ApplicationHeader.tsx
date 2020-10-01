import React from 'react'
import { Card } from 'semantic-ui-react'

export interface AppHederProps {
  appId: string
  mode?: string
  summary?: boolean
  sectionName?: string
  page?: string
}

const ApplicationHeader: React.FC<AppHederProps> = (props) => {
  const { appId, mode, summary, sectionName, page } = props

  return (
    <Card>
      <Card.Content header={`Application no.${appId}`} />
      {mode && <Card.Content meta={mode} />}
      {summary ? (
        <Card.Content description={`SUMMARY page of the Application`} />
      ) : sectionName && page ? (
        <Card.Content description={`PAGE ${page} of SECTION ${sectionName}`} />
      ) : (
        <Card.Content description={`HOME page of the Application`} />
      )}
    </Card>
  )
}

export default ApplicationHeader
