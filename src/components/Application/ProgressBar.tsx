import React from 'react'
import { Link } from 'react-router-dom'
import {
  Accordion,
  Button,
  Container,
  Grid,
  Header,
  Label,
  Menu,
  Segment,
  Sticky,
} from 'semantic-ui-react'
import { TemplateSectionPayload } from '../../utils/types'

interface ProgressBarProps {
  templateSections: TemplateSectionPayload[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ templateSections }) => {
  const isLastElement = (element: number) => templateSections.length > element

  const childrenPanels = (step: number, totalPages: number) => {
    const pages = Array.from(Array(totalPages).keys(), (n) => n + 1)
    return pages.map((number) => {
      return {
        key: `progress_${step}_${number}`,
        title: {
          children: (
            <Header
              disabled
              size="small"
              as={Link}
              key={`page_${number}`}
              content={`Page${number}`}
            />
          ),
        },
      }
    })
  }

  const rootPanels = templateSections.map((section, index) => {
    const stepNumber = index + 1

    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <Grid>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={14} verticalAlign="middle">
              {getStepNumber(stepNumber, isLastElement(stepNumber))}
              {section.title}
            </Grid.Column>
          </Grid>
        ),
      },
      content: {
        content: (
          <Grid>
            <Grid.Column width={4}></Grid.Column>
            <Grid.Column width={12}>
              <Accordion.Accordion panels={childrenPanels(stepNumber, section.totalPages)} />
            </Grid.Column>
          </Grid>
        ),
      },
    }
  })

  return (
    <Sticky>
      <Container>
        <Header as="h5" textAlign="center" content="Steps to complete form" />
        <Accordion defaultActiveIndex={0} panels={rootPanels} />
      </Container>
    </Sticky>
  )
}

const getStepNumber = (stepNumber: number, isLastElement: boolean) => (
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
