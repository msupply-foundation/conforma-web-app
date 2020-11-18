import React from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import { ProgressInApplication, ProgressInPage, ProgressInSection } from '../../utils/types'

interface SectionPage {
  sectionIndex: number
  currentPage: number
}

interface ProgressBarProps {
  serialNumber: string
  currentSectionPage?: SectionPage
  progressStructure: ProgressInApplication
  push: (path: string) => void
  validateCurrentPage: () => boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  serialNumber,
  currentSectionPage,
  progressStructure,
  push,
  validateCurrentPage,
}) => {
  const pageList = (
    index: number,
    sectionCode: string,
    pages: { [page: number]: ProgressInPage }
  ) => {
    return (
      <List link>
        {Object.entries(pages).map(([number, currentPage]) => (
          <List.Item
            as="a"
            key={`page_${number}`}
            onClick={() =>
              attemptChangeToPage({
                serialNumber,
                sectionCode,
                page: Number(number),
                push,
                validateCurrentPage,
              })
            }
            active={currentPage.visited} // TODO: Change to only show active when visited in linear applications
          >
            {currentPage.pageStatus == true ? (
              <Icon name="check circle" color="green" />
            ) : currentPage.pageStatus == false ? (
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
    const sectionItems = progressStructure.map((section, index) => {
      const stepNumber = index + 1

      return {
        key: `progress_${stepNumber}`,
        title: {
          children: (
            <Grid>
              <Grid.Column width={4} textAlign="right" verticalAlign="middle">
                {section.sectionStatus !== undefined ? (
                  section.sectionStatus ? (
                    <Icon name="check circle" color="green" />
                  ) : (
                    <Icon name="exclamation circle" color="red" />
                  )
                ) : (
                  getStepNumber(stepNumber)
                )}
              </Grid.Column>
              <Grid.Column width={12} textAlign="left" verticalAlign="middle">
                <Header size="small" content={section.title} />
              </Grid.Column>
            </Grid>
          ),
        },
        onTitleClick: () =>
          attemptChangeToPage({
            serialNumber,
            sectionCode: section.code,
            page: 1,
            push,
            validateCurrentPage,
          }),
        content: {
          content: (
            <Grid divided>
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={12}>{pageList(index, section.code, section.pages)}</Grid.Column>
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
      onTitleClick: () =>
        attemptChangeToPage({
          serialNumber,
          push,
          validateCurrentPage,
        }),
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

interface attemptChangePageProps {
  serialNumber: string
  sectionCode?: string
  page?: number
  push: (path: string) => void
  validateCurrentPage: () => boolean
}

const attemptChangeToPage = ({
  serialNumber,
  sectionCode,
  page,
  push,
  validateCurrentPage,
}: attemptChangePageProps) => {
  const status = validateCurrentPage()
  if (status) {
    sectionCode && page
      ? push(`/applications/${serialNumber}/${sectionCode}/Page${page}`)
      : push(`/applications/${serialNumber}/summary`)
  }
}

export default ProgressBar
