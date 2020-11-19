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
  const pageList = (sectionCode: string, pages: ProgressInPage[]) => {
    return (
      <List link>
        {pages.map((page) => {
          const { pageName, isActive, status } = page
          return (
            <List.Item
              as="a"
              key={`progress_${page.pageName}`}
              onClick={() =>
                attemptChangeToPage({
                  serialNumber,
                  sectionCode,
                  pageName,
                  push,
                  validateCurrentPage,
                })
              }
              active={isActive}
            >
              {status == true ? (
                <Icon name="check circle" color="green" />
              ) : status == false ? (
                <Icon name="exclamation circle" color="red" />
              ) : null}
              <List.Content>
                <List.Header>{pageName}</List.Header>
              </List.Content>
            </List.Item>
          )
        })}
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
                {section.status !== undefined ? (
                  section.status ? (
                    <Icon name="check circle" size="large" color="green" />
                  ) : (
                    <Icon name="exclamation circle" size="large" color="red" />
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
            pageName: 'Page1',
            push,
            validateCurrentPage,
          }),
        content: {
          content: (
            <Grid divided>
              <Grid.Column width={4}></Grid.Column>
              <Grid.Column width={12}>{pageList(section.code, section.pages)}</Grid.Column>
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
        activeIndex={currentSectionPage ? currentSectionPage.sectionIndex : 0} //TODO: Change to get active from structure
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
  pageName?: string
  push: (path: string) => void
  validateCurrentPage: () => boolean
}

const attemptChangeToPage = ({
  serialNumber,
  sectionCode,
  pageName,
  push,
  validateCurrentPage,
}: attemptChangePageProps) => {
  const status = validateCurrentPage()
  if (status) {
    sectionCode && pageName
      ? push(`/applications/${serialNumber}/${sectionCode}/${pageName.trim()}`)
      : push(`/applications/${serialNumber}/summary`)
  }
}

export default ProgressBar
