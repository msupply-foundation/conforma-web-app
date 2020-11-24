import React from 'react'
import {
  Accordion,
  Container,
  Grid,
  Header,
  Icon,
  Item,
  Label,
  List,
  Sticky,
} from 'semantic-ui-react'
import {
  ProgressInApplication,
  ProgressInPage,
  ProgressStatus,
  ReviewCode,
} from '../../utils/types'

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
  const getPageIndicator = (status: ProgressStatus | undefined) => {
    const indicator = {
      VALID: <Icon name="check circle" color="green" />,
      NOT_VALID: <Icon name="exclamation circle" color="red" />,
      INCOMPLETE: <Icon name="circle outline" />,
    }
    return status ? indicator[status] : null
  }

  const pageList = (sectionCode: string, pages: ProgressInPage[]) => {
    return (
      <List style={{ paddingLeft: '50px' }} link>
        {pages.map((page) => {
          const { canNavigate, isActive, pageName, status } = page
          return (
            <List.Item
              active={isActive}
              as="a"
              disabled={isActive || !canNavigate}
              header={pageName}
              icon={getPageIndicator(status)}
              key={`progress_${page.pageName}`}
              onClick={() =>
                attemptChangeToPage({
                  serialNumber,
                  sectionCode,
                  pageName,
                  canNavigate,
                  push,
                  validateCurrentPage,
                })
              }
            />
          )
        })}
      </List>
    )
  }

  const getSectionIndicator = (status: ProgressStatus | undefined, step: number) => {
    const getStepNumber = (stepNumber: number) => (
      <Label circular as="a" basic color="blue" key={`progress_${stepNumber}`}>
        {stepNumber}
      </Label>
    )

    const indicator = {
      VALID: <Icon name="check circle" color="green" size="large" />,
      NOT_VALID: <Icon name="exclamation circle" color="red" size="large" />,
      INCOMPLETE: getStepNumber(step),
    }
    return status ? indicator[status] : getStepNumber(step)
  }

  const sectionList = () => {
    return progressStructure.map((section, index) => {
      const stepNumber = index + 1
      const { canNavigate, code, isActive, pages, status, title } = section

      return {
        key: `progress_${stepNumber}`,
        title: {
          children: (
            <Grid>
              <Grid.Column width={4} textAlign="right" verticalAlign="middle">
                {getSectionIndicator(status, stepNumber)}
              </Grid.Column>
              <Grid.Column width={12} textAlign="left" verticalAlign="middle">
                <Header as={isActive ? 'h3' : 'h4'} disabled={!canNavigate}>
                  {title}
                </Header>
              </Grid.Column>
            </Grid>
          ),
        },
        onTitleClick: () =>
          attemptChangeToPage({
            serialNumber,
            sectionCode: code === 'PR' ? undefined : code,
            pageName: code === 'PR' ? undefined : 'Page1',
            canNavigate,
            push,
            validateCurrentPage,
          }),
        content: {
          content: pages ? pageList(code, pages) : null,
        },
      }
    })
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

interface attemptChangePageProps {
  serialNumber: string
  sectionCode?: string
  pageName?: string
  canNavigate: boolean
  push: (path: string) => void
  validateCurrentPage: () => boolean
}

const attemptChangeToPage = ({
  serialNumber,
  sectionCode,
  pageName,
  canNavigate,
  push,
  validateCurrentPage,
}: attemptChangePageProps) => {
  if (canNavigate || validateCurrentPage()) {
    sectionCode && pageName
      ? push(`/applications/${serialNumber}/${sectionCode}/${pageName.trim()}`)
      : push(`/applications/${serialNumber}/summary`)
  }
}

export default ProgressBar
