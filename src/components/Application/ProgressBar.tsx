import React, { useState, useEffect } from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import { CurrentPage, PageElements, SectionProgress, SectionsStructure } from '../../utils/types'
import { useApplicationState } from '../../contexts/ApplicationState'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'
import { PROGRESS_STATUS, getCombinedStatus } from '../../utils/helpers/application/validatePage'
import { getPageElementsStatuses } from '../../utils/helpers/application/getPageElements'

interface ProgressBarProps {
  serialNumber: string
  current: CurrentPage
  isLinear: boolean
  sections: SectionsStructure
  getPreviousPage: (props: { sectionCode: string; pageNumber: number }) => CurrentPage | undefined
  validateElementsInPage: (props: CurrentPage) => boolean
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
  current,
  isLinear,
  sections,
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

  const isPreviousPageIsValid = (sectionCode: string, pageNumber: number) => {
    const previousPage = getPreviousPage({ sectionCode, pageNumber })
    return previousPage && validateElementsInPage(previousPage)
  }

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
      if (canNavigate || validateElementsInPage({ ...current }))
        push(`/application/${serialNumber}/${sectionCode}/Page${pageNumber}`)
    } else {
      if (canNavigate || isPreviousPageIsValid(code as string, 1))
        push(`/application/${serialNumber}/${code}/Page${1}`)
    }
  }

  const getPageIndicator = (pageState: PageElements) => {
    const pageStatuses = getPageElementsStatuses(pageState)

    const statuses = Object.values(pageStatuses)
    const pageStatus = getCombinedStatus(statuses)

    const indicator = {
      VALID: <Icon name="check circle" color="green" />,
      NOT_VALID: <Icon name="exclamation circle" color="red" />,
      INCOMPLETE: <Icon name="circle outline" />,
    }
    return status ? indicator[pageStatus] : null
  }

  const redirectToPage = (sectionCode: string, pageName: string) => {
    // TODO
    {
      setClickedLinkParameters({
        canNavigate: true,
        sectionCode,
        pageNumber: Number(pageName.split(' ')[1]), // TODO: Need access to page number
        pageOrSection: 'page',
      })
      setProgressLinkClicked(true)
    }
  }

  const pageList = (
    sectionCode: string,
    pages: {
      [pageName: string]: PageElements
    }
  ) => {
    const isActivePage = (code: string, pageName: string) =>
      current.section.code === code && current.page === Number(pageName.split(' ')[1]) // TODO: Need access to page number

    return (
      <List style={{ paddingLeft: '50px' }} link>
        {Object.entries(pages).map(([pageName, state]) => {
          return (
            <List.Item
              active={isActivePage(sectionCode, pageName)}
              as="a"
              key={`ProgressSection_${sectionCode}_${pageName}`}
              onClick={() => redirectToPage(sectionCode, pageName)}
            >
              {getPageIndicator(state)}
              {pageName}
            </List.Item>
          )
        })}
      </List>
    )
  }

  const getSectionIndicator = (progress: SectionProgress | undefined, step: number) => {
    if (!progress?.completed)
      return (
        <Label circular as="a" basic color="blue" key={`progress_${step}`}>
          {step}
        </Label>
      )
    const { completed, valid } = progress
    if (completed && valid) return <Icon name="check circle" color="green" size="large" />
    if (completed && !valid) return <Icon name="exclamation circle" color="red" size="large" />
  }

  const redirectToSection = (code: string, pageName: string) => {
    // TODO
    setClickedLinkParameters({
      canNavigate: true,
      code,
      pageOrSection: 'section',
    })
    setProgressLinkClicked(true)
  }

  const sectionList = () => {
    const isActiveSection = (code: string) => current.section.code === code
    const isDisabled = (index: number) => isLinear && current.section.index < index

    return Object.values(sections).map(({ details, progress, pages }) => {
      const stepNumber = details.index + 1
      const { code, index, title } = details
      return {
        key: `progress_${stepNumber}`,
        title: {
          children: (
            <Grid>
              <Grid.Column width={4} textAlign="right" verticalAlign="middle">
                {getSectionIndicator(progress, stepNumber)}
              </Grid.Column>
              <Grid.Column width={12} textAlign="left" verticalAlign="middle">
                <Header as={isActiveSection(code) ? 'h3' : 'h4'} disabled={isDisabled(index)}>
                  {title}
                </Header>
              </Grid.Column>
            </Grid>
          ),
        },
        onTitleClick: () => redirectToSection(code, 'Page 1'),
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
        activeIndex={current.section.index} //TODO: Check if section index match section in list
        panels={sectionList()}
      />
    </Sticky>
  )
}

export default ProgressBar
