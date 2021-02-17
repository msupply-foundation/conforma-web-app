import React, { useState, useEffect } from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import {
  CurrentPage,
  ProgressInApplication,
  ProgressInPage,
  ProgressStatus,
} from '../../utils/types'
import { useApplicationState } from '../../contexts/ApplicationState'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'

interface SectionPage {
  sectionIndex: number
  currentPage: number
}

interface ProgressBarProps {
  serialNumber: string
  currentSectionPage?: SectionPage
  progressStructure: ProgressInApplication
  getPreviousPage: (props: { sectionCode: string; pageNumber: number }) => CurrentPage | undefined
  validateElementsInPage: (props?: CurrentPage) => boolean
}

interface ClickedLinkParameters {
  canNavigate: boolean
  sectionCode?: string
  pageNumber?: number
  code?: string
  pageOrSection?: 'page' | 'section'
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  serialNumber,
  currentSectionPage,
  progressStructure,
  getPreviousPage,
  validateElementsInPage,
}) => {
  const { push } = useRouter()
  const {
    applicationState: {
      inputElementsActivity: { areTimestampsInSequence },
    },
  } = useApplicationState()
  const [progressLinkClicked, setProgressLinkClicked] = useState(false)
  const [clickedLinkParameters, setClickedLinkParameters] = useState<ClickedLinkParameters>({
    canNavigate: false,
    sectionCode: '',
    pageNumber: 0,
  })

  // Make sure all responses are up-to-date (areTimestampsInSequence)
  // and only proceed when button is clicked AND responses are ready
  useEffect(() => {
    if (areTimestampsInSequence && progressLinkClicked) {
      handleLinkClick()
    }
  }, [areTimestampsInSequence, progressLinkClicked])

  const handleLinkClick = async () => {
    const { canNavigate, sectionCode, pageNumber, code, pageOrSection } = clickedLinkParameters
    setProgressLinkClicked(false)
    if (pageOrSection === 'page') {
      if (canNavigate || validateElementsInPage())
        push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
    } else {
      if (canNavigate || isPreviousPageIsValid(code as string, 1))
        push(`/application/${serialNumber}/${code}/Page${1}`)
    }
  }

  const getPageIndicator = (status: ProgressStatus | undefined) => {
    const indicator = {
      VALID: <Icon name="check circle" color="green" />,
      NOT_VALID: <Icon name="exclamation circle" color="red" />,
      INCOMPLETE: <Icon name="circle outline" />,
    }
    return status ? indicator[status] : null
  }

  const isPreviousPageIsValid = (sectionCode: string, pageNumber: number) => {
    const previousPage = getPreviousPage({ sectionCode, pageNumber })
    return previousPage && validateElementsInPage(previousPage)
  }

  const pageList = (sectionCode: string, pages: ProgressInPage[]) => {
    return (
      <List style={{ paddingLeft: '50px' }} link>
        {pages.map((page) => {
          const { canNavigate, isActive, pageNumber, status } = page

          return (
            <List.Item
              active={isActive}
              as="a"
              key={`ProgressSection_${sectionCode}_${pageNumber}`}
              onClick={() => {
                setClickedLinkParameters({
                  canNavigate,
                  sectionCode,
                  pageNumber,
                  pageOrSection: 'page',
                })
                setProgressLinkClicked(true)
              }}
            >
              {getPageIndicator(status)}
              {`Page ${pageNumber}`}
            </List.Item>
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
        onTitleClick: () => {
          setClickedLinkParameters({
            canNavigate,
            code,
            pageOrSection: 'section',
          })
          setProgressLinkClicked(true)
        },
        content: {
          content: pages ? pageList(code, pages) : null,
        },
      }
    })
  }

  return (
    <Sticky as={Container}>
      <Header as="h5" style={{ paddingLeft: 30 }}>
        {strings.TITLE_INTRODUCTION}
      </Header>
      <Accordion
        activeIndex={currentSectionPage ? currentSectionPage.sectionIndex : 0} //TODO: Change to get active from structure
        panels={sectionList()}
      />
    </Sticky>
  )
}

export default ProgressBar
