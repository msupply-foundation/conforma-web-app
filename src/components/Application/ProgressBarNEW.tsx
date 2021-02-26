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
} from '../../utils/types'

interface ProgressBarProps {
  structure: FullStructure
  requestRevalidation: MethodRevalidate
}

const ProgressBarNEW: React.FC<ProgressBarProps> = ({ structure, requestRevalidation }) => {
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
    if (!structure.info.isLinear)
      push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)

    // Use validationMethod to check if can change to page (on linear application) OR
    // display current page with strict validation
    requestRevalidation(({ firstIncompletePage, setStrictSectionPage }: MethodToCallProps) => {
      if (
        firstIncompletePage &&
        checkPageIsAccessible({
          fullStructure: structure,
          firstIncomplete: firstIncompletePage,
          current: { sectionCode, pageNumber },
        })
      ) {
        push(`/applicationNEW/${structure.info.serial}/${sectionCode}/Page${pageNumber}`)
      } else setStrictSectionPage(firstIncompletePage)
    })
  }

  const getPageList = (sectionCode: string, pages: { [pageNumber: string]: PageNEW }) => {
    const isActivePage = (sectionCode: string, pageNumber: number) =>
      currentSectionCode === sectionCode && Number(page) === pageNumber

    return (
      <List
        link
        style={{ paddingLeft: '50px' }}
        items={Object.entries(pages).map(([number, { name: pageName, progress }]) => ({
          key: `ProgressSection_${sectionCode}_${number}`,
          active: isActivePage(sectionCode, Number(number)),
          as: 'a',
          icon: progress ? getIndicator(progress) : null,
          content: pageName,
          onClick: () => handleChangeToPage(sectionCode, Number(number)),
        }))}
      />
    )
  }

  const getIndicator = (progress: Progress, step?: number) => {
    const { completed, valid } = progress
    if (!completed)
      return step ? (
        <Label circular as="a" basic color="blue" key={`progress_${step}`}>
          {step}
        </Label>
      ) : (
        <Icon name="circle outline" />
      )
    return (
      <Icon
        name={valid ? 'check circle' : 'exclamation circle'}
        color={valid ? 'green' : 'red'}
        size={step ? 'large' : 'small'}
      />
    )
  }

  const sectionsList = Object.values(sections).map(({ details, progress, pages }, index) => {
    const stepNumber = index + 1
    const { code, title } = details
    return {
      key: `progress_${stepNumber}`,
      title: {
        children: (
          <Grid>
            <Grid.Column width={4} textAlign="right" verticalAlign="middle">
              {progress && getIndicator(progress, stepNumber)}
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
        content: getPageList(code, pages),
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
