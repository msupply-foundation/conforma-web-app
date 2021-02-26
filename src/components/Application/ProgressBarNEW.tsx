import React from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import checkPageIsAccessible from '../../utils/helpers/structure/checkPageIsAccessible'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  FullStructure,
  MethodRevalidate,
  MethodToCallProps,
  PageNEW,
  Progress,
  SectionAndPage,
} from '../../utils/types'

interface ProgressBarProps {
  structure: FullStructure
  requestRevalidation: MethodRevalidate
  strictSectionPage: SectionAndPage | null
}

const ProgressBarNEW: React.FC<ProgressBarProps> = ({
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
      push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
      return
    }

    // Use validationMethod to check if can change to page (on linear application) OR
    // display current page with strict validation
    requestRevalidation(({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
      if (!firstStrictInvalidPage) {
        setStrictSectionPage(null)
        push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
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
        push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
      } else {
        setStrictSectionPage(firstStrictInvalidPage)
        push(
          `/applicationNEW/${structure.info.serial}/${firstStrictInvalidPage.sectionCode}/Page${firstStrictInvalidPage.pageNumber}`
        )
      }
    })
  }

  const getPageList = (
    sectionCode: string,
    pages: { [pageNumber: string]: PageNEW },
    isIsStrictSection: boolean
  ) => {
    const isActivePage = (sectionCode: string, pageNumber: number) =>
      currentSectionCode === sectionCode && Number(page) === pageNumber

    const checkPageIsStrict = (pageNumber: string) =>
      isIsStrictSection && strictSectionPage?.pageNumber === Number(pageNumber)

    return (
      <List
        link
        style={{ paddingLeft: '50px' }}
        items={Object.entries(pages).map(([number, { name: pageName, progress }]) => ({
          key: `ProgressSection_${sectionCode}_${number}`,
          active: isActivePage(sectionCode, Number(number)),
          as: 'a',
          icon: progress ? getIndicator(progress, checkPageIsStrict(number)) : null,
          content: pageName,
          onClick: () => handleChangeToPage(sectionCode, Number(number)),
        }))}
      />
    )
  }

  const getIndicator = (progress: Progress, isStrict: boolean, step?: number) => {
    const { completed, valid } = progress
    const isStrictlylInvalid = !valid || (isStrict && !completed)

    if (!completed && !isStrict)
      return step ? (
        <Label circular as="a" basic color="blue" key={`progress_${step}`}>
          {step}
        </Label>
      ) : (
        <Icon name="circle outline" />
      )
    return (
      <Icon
        name={isStrictlylInvalid ? 'exclamation circle' : 'check circle'}
        color={isStrictlylInvalid ? 'red' : 'green'}
        size={step ? 'large' : 'small'}
      />
    )
  }

  const sectionsList = Object.values(sections).map(({ details, progress, pages }, index) => {
    const isIsStrictSection = !!strictSectionPage && strictSectionPage.sectionCode === details.code

    const stepNumber = index + 1
    const { code, title } = details
    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <Grid>
            <Grid.Column width={4} textAlign="right" verticalAlign="middle">
              {progress && getIndicator(progress, isIsStrictSection, stepNumber)}
            </Grid.Column>
            <Grid.Column width={12} textAlign="left" verticalAlign="middle">
              <Header as="h4">{title}</Header>
            </Grid.Column>
          </Grid>

          // OR:
          // <div>
          //   {progress && getIndicator(progress, stepNumber)}
          //   <Label basic disabled={isSectionDisabled(index)} content={title} />
          // </div>
        ),
      },
      onTitleClick: () => handleChangeToPage(code, 1),
      content: {
        content: getPageList(code, pages, isIsStrictSection),
      },
    }
  })

  return (
    <Sticky as={Container}>
      <Header as="h5" style={{ paddingLeft: 30 }}>
        {strings.TITLE_INTRODUCTION}
      </Header>
      <Accordion activeIndex={activeIndex} panels={sectionsList} />
    </Sticky>
  )
}

export default ProgressBarNEW
