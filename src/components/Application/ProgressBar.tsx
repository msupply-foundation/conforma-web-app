import React from 'react'
import { Accordion, Container, Grid, Header, Label, Segment, Sticky } from 'semantic-ui-react'
import { TemplateSectionPayload } from '../../utils/types'

interface ProgressBarProps {
  templateSections: TemplateSectionPayload[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ templateSections }) => {
  const isLastElement = (element: number) => templateSections.length > element
  const panels = templateSections.map((section, index) => {
    const stepNumber = index + 1
    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <Segment basic disabled>
            {getSectionTitle(stepNumber, isLastElement(stepNumber))}
            {section.title}
          </Segment>
        ),
      },
    }
  })

  return (
    <Sticky>
      <Container>
        <Header as="h5" textAlign="center" content="Steps to complete form" />
        <Accordion panels={panels} />
      </Container>
    </Sticky>
  )
}

const getSectionTitle = (stepNumber: number, isLastElement: boolean) => (
  //   isLastElement ? (
  <Label circular as="a" basic color="blue" key={`progress_${stepNumber}`}>
    {stepNumber}
  </Label>
)
//   ) : (
// Note: Attempt to use the vertical divider...
// <Divider vertical>
//   <Label circular as="a" basic color="blue" key={`progress_${stepNumber}`}>
//     {stepNumber}
//   </Label>
// </Divider>
//   )

export default ProgressBar
