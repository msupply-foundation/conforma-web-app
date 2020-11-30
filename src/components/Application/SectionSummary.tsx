import React from 'react'
import { Header, Segment } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../formElementPlugins'
import { ElementAndResponse, SectionElementStates } from '../../utils/types'

interface ApplicationSummaryProps {
  sectionPages: SectionElementStates
  editable: boolean
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ sectionPages, editable }) => {
  const { sectionTitle, pages } = sectionPages
  return (
    <Segment.Group size="large">
      <Header as="h2" content={`${sectionTitle}`} />
      {Object.values(pages).map((elements: ElementAndResponse[]) =>
        elements.map((elementAndResponse) => <SummaryViewWrapper {...elementAndResponse} />)
      )}
    </Segment.Group>
  )
}

export default ApplicationSummary
