import React from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { checkPageIsAccessible } from '../../utils/helpers/structure'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  FullStructure,
  MethodRevalidate,
  MethodToCallProps,
  Page,
  ApplicationProgress,
  SectionAndPage,
} from '../../utils/types'

interface ProgressBarProps {
  structure: FullStructure
  requestRevalidation: MethodRevalidate
  strictSectionPage: SectionAndPage | null
}

enum ProgressType {
  section = 'SECTION',
  page = 'PAGE',
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  structure,
  requestRevalidation,
  strictSectionPage,
}) => {
  const {
    info: { isLinear },
    sections,
  } = structure

  const {
    query: { sectionCode: currentSectionCode, page },
    push,
  } = useRouter()

  const activeIndex =
    Object.values(sections).findIndex(({ details }) => details.code === currentSectionCode) || 0

  const handleChangeToPage = (sectionCode: string, pageNumber: number) => {
    if (!isLinear) {
      push(`/application/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
      return
    }

    // Use validationMethod to check if can change to page (on linear application) OR
    // display current page with strict validation
    requestRevalidation(({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
      if (!firstStrictInvalidPage) {
        setStrictSectionPage(null)
        push(`/application/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
        return
      }
      if (
        checkPageIsAccessible({
          fullStructure: structure,
          firstIncomplete: firstStrictInvalidPage,
          current: { sectionCode, pageNumber },
        })
      ) {
        setStrictSectionPage(null)
        push(`/application/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
      } else {
        setStrictSectionPage(firstStrictInvalidPage)
        push(
          `/application/${structure.info.serial}/${firstStrictInvalidPage.sectionCode}/Page${firstStrictInvalidPage.pageNumber}`
        )
      }
    })
  }

  const getPageList = (
    sectionCode: string,
    pages: { [pageNumber: string]: Page },
    isStrictSection: boolean
  ) => {
    const isActivePage = (sectionCode: string, pageNumber: number) =>
      currentSectionCode === sectionCode && Number(page) === pageNumber

    const checkPageIsStrict = (pageNumber: string) =>
      isStrictSection && strictSectionPage?.pageNumber === Number(pageNumber)

    return (
      <List className="page-list">
        {Object.entries(pages).map(([number, { name: pageName, progress }]) => (
          <List.Item
            key={`ProgressSection_${sectionCode}_${number}`}
            active={isActivePage(sectionCode, Number(number))}
            // as="a"
            onClick={() => handleChangeToPage(sectionCode, Number(number))}
          >
            <Grid className="progress-row page-row">
              <Grid.Column
                width={3}
                textAlign="right"
                verticalAlign="middle"
                // className="progress-indicator"
              >
                {progress ? (
                  getIndicator(
                    progress,
                    checkPageIsStrict(number),
                    isActivePage(sectionCode, Number(number)),
                    ProgressType.page
                  )
                ) : (
                  <div className="progress-page-indicator" />
                )}
              </Grid.Column>
              <Grid.Column width={13} textAlign="left" verticalAlign="middle">
                <p>{pageName}</p>
              </Grid.Column>
            </Grid>
          </List.Item>
        ))}
      </List>
    )
  }

  // Maps types of indicators to specific Icon components
  const progressIconMap = {
    error: [
      <Icon name={'exclamation circle'} color={'pink'} className="progress-indicator" />,
      <Icon name={'exclamation circle'} color={'pink'} className="progress-page-indicator" />,
    ],
    completed: [
      <Icon name="check circle" color="green" className="progress-indicator" />,
      <Icon name="circle" color="green" size="tiny" className="progress-page-indicator" />,
    ],
    notStarted: [
      <Icon name="circle outline" className="progress-indicator" />,
      <div className="progress-page-indicator" />,
    ],
    incomplete: [
      <Icon name="circle outline" color="green" className="progress-indicator" />,
      <div className="progress-page-indicator" />,
    ],
    current: [
      <Icon.Group>
        <Icon name="circle outline" className="progress-indicator dark-grey" />
        <Icon name="circle" color="blue" size="mini" className="progress-indicator" />
      </Icon.Group>,
      <Icon name="circle" color="blue" size="tiny" className="progress-page-indicator" />,
    ],
  }

  // We want to be able to show FIVE states:
  //    (but some may show same icon)
  // error -> if at least one error or if not completed and strict
  // success -> if completed and valid
  // not started -> nothing has been filled in section/page
  // incomplete -> started but not invalid (probably display same as not started)
  // current -> "dot" in circle to show current section/page
  const getIndicator = (
    progress: ApplicationProgress,
    isStrict: boolean,
    isActive: boolean,
    type = ProgressType.section
  ) => {
    const { completed, valid } = progress
    const isStrictlylInvalid = !valid || (isStrict && !completed)
    const isStarted = progress.doneNonRequired + progress.doneRequired > 0
    const typeIndex = type === ProgressType.section ? 0 : 1

    if (isStrictlylInvalid) return progressIconMap.error[typeIndex]
    if (completed && valid) return progressIconMap.completed[typeIndex]
    if (isActive) return progressIconMap.current[typeIndex]
    if (isStarted) return progressIconMap.incomplete[typeIndex]
    return progressIconMap.notStarted[typeIndex]
  }

  const sectionsList = [...Object.values(sections)].map(({ details, progress, pages }, index) => {
    const isStrictSection = !!strictSectionPage && strictSectionPage.sectionCode === details.code
    console.log('Sections', sections)

    const stepNumber = index + 1
    const { code, title } = details
    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <Grid className="progress-row">
            <Grid.Column
              width={3}
              textAlign="right"
              verticalAlign="middle"
              // className="progress-indicator"
            >
              {progress && getIndicator(progress, isStrictSection, index === activeIndex)}
            </Grid.Column>
            <Grid.Column width={13} textAlign="left" verticalAlign="middle">
              <p>{title}</p>
            </Grid.Column>
          </Grid>
        ),
      },
      onTitleClick: () => handleChangeToPage(code, 1),
      content: {
        content: getPageList(code, pages, isStrictSection),
      },
    }
  })

  return (
    <Sticky as={Container} id="application-progress" offset={135}>
      <Grid className="progress-row">
        <Grid.Column
          width={3}
          textAlign="right"
          verticalAlign="middle"
          // className="progress-indicator"
        ></Grid.Column>
        <Grid.Column width={13} textAlign="left" verticalAlign="middle">
          <p>{strings.TITLE_INTRODUCTION}</p>
        </Grid.Column>
      </Grid>
      <Accordion activeIndex={activeIndex} panels={sectionsList} />
    </Sticky>
  )
}

export default ProgressBar
