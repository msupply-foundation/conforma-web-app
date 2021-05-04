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

enum SectionOrPage {
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

    return <p>*</p>
    // return (
    //   <List
    //     link
    //     items={Object.entries(pages).map(([number, { name: pageName, progress }]) => ({
    //       key: `ProgressSection_${sectionCode}_${number}`,
    //       active: isActivePage(sectionCode, Number(number)),
    //       as: 'a',
    //       icon: progress
    //         ? getIndicator(progress, checkPageIsStrict(number), Number(number), SectionOrPage.page)
    //         : null,
    //       content: pageName,
    //       onClick: () => handleChangeToPage(sectionCode, Number(number)),
    //     }))}
    //   />
    // )
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
    step?: number,
    type = SectionOrPage.section
  ) => {
    console.log('progress', progress)
    console.log('step', step)
    const { completed, valid } = progress
    const isStrictlylInvalid = !valid || (isStrict && !completed)

    if (isStrictlylInvalid) return <Icon name={'exclamation circle'} color={'pink'} />
    if (completed && valid) {
      if (type === SectionOrPage.section) return <Icon name={'check circle'} color={'green'} />
      else return <Icon name={'dot circle outline'} color={'grey'} />
    }
    // if

    // return <Icon name="circle outline" />
    return step ? (
      <Label circular as="a" basic color="blue" key={`progress_${step}`}>
        {step}
      </Label>
    ) : (
      <Icon name="circle outline" />
    )
  }

  const sectionsList = [...Object.values(sections)].map(({ details, progress, pages }, index) => {
    const isStrictSection = !!strictSectionPage && strictSectionPage.sectionCode === details.code

    const stepNumber = index + 1
    const { code, title } = details
    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <div className="progress-row">
            <div className="progress-indicator">
              {progress && getIndicator(progress, isStrictSection, stepNumber)}
            </div>
            <div className="progress-name">
              <p>{title}</p>
            </div>
          </div>
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
      <div className="progress-row">
        <div className="progress-icon">{/* <Icon name="circle outline" /> */}</div>
        <div className="progress-name">
          <p>{strings.TITLE_INTRODUCTION}</p>
        </div>
      </div>
      <Accordion activeIndex={activeIndex} panels={sectionsList} />
    </Sticky>
  )
}

export default ProgressBar
