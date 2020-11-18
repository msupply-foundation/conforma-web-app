import React from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import { ProgressInApplication, ProgressInPage } from '../../utils/types'

interface SectionPage {
  sectionIndex: number
  currentPage: number
}

interface ProgressBarProps {
  serialNumber: string
  currentSectionPage?: SectionPage
  progressStructure: ProgressInApplication
  push: (path: string) => void
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  serialNumber,
  currentSectionPage,
  progressStructure,
  push,
}) => {
  console.log('Progress bar', progressStructure)

  const pageList = (sectionCode: string, pages: { [page: number]: ProgressInPage }) => {
    // const pages = Array.from(Array(totalPages).keys(), (n) => n + 1)
    return (
      <List link>
        {Object.entries(pages).map(([number, page]) => (
          <List.Item
            as="a"
            key={`page_${number}`}
            href={`/applications/${serialNumber}/${sectionCode}/Page${number}`}
            active={page.visited} // TODO: Change to only show active when visited in Non-linear application
          >
            {page.pageStatus == true ? (
              <Icon name="check circle" color="green" />
            ) : page.pageStatus == false ? (
              <Icon name="exclamation circle" color="red" />
            ) : null}
            <List.Content>
              <List.Header>{`Page ${number}`}</List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    )
  }

  const sectionList = () => {
    const sectionItems = Object.entries(progressStructure).map(([code, section], index) => {
      const stepNumber = index + 1

      return {
        key: `progress_${stepNumber}`,
        title: {
          children: (
            <Grid>
              <Grid.Column width={4} textAlign="right" verticalAlign="middle">
                {getStepNumber(stepNumber)}
              </Grid.Column>
              <Grid.Column width={12} textAlign="left" verticalAlign="middle">
                <Header size="small" content={section.title} />
              </Grid.Column>
            </Grid>
          ),
        },
        onTitleClick: () => push(`/applications/${serialNumber}/${code}/Page1`),
        content: {
          content: (
            <Grid divided>
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={12}>{pageList(code, section.pages)}</Grid.Column>
            </Grid>
          ),
        },
      }
    })

    const summaryNumber = sectionItems.length + 1
    sectionItems.push({
      key: 'progress_summary',
      title: {
        children: (
          <Grid>
            <Grid.Column width={4} textAlign="right" verticalAlign="middle">
              {getStepNumber(summaryNumber)}
            </Grid.Column>
            <Grid.Column width={12} textAlign="left" verticalAlign="middle">
              <Header size="small" content={'Review and submit'} />
            </Grid.Column>
          </Grid>
        ),
      },
      onTitleClick: () => push(`/applications/${serialNumber}/summary`),
      // Ideally these aren't needed - Couldn't find some way to remove this
      content: {
        content: <Header />,
      },
    })
    return sectionItems
  }

  return (
    <Sticky as={Container}>
      <Header as="h5" textAlign="center" content="Steps to complete form" />
      <Accordion
        activeIndex={currentSectionPage ? currentSectionPage.sectionIndex : 0}
        panels={sectionList()}
      />
    </Sticky>
  )
}

const getStepNumber = (stepNumber: number) => (
  <Label circular as="a" basic color="blue" key={`progress_${stepNumber}`}>
    {stepNumber}
  </Label>
)

export default ProgressBar
