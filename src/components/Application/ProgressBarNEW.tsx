import React from 'react'
import { Accordion, Container, Grid, Header, Icon, Label, List, Sticky } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { FullStructure, PageNEW, Progress } from '../../utils/types'

interface ProgressBarProps {
  structure: FullStructure
  changePage: (sectionCode: string, pageNumber: number) => void
  current: {
    sectionCode: string
    page: number
  }
}

const ProgressBarNEW: React.FC<ProgressBarProps> = ({ structure, changePage, current }) => {
  const {
    info: { isLinear },
    sections,
  } = structure

  const activeIndex =
    Object.values(sections).findIndex(({ details }) => details.code === current.sectionCode) || 0

  const getPageList = (sectionCode: string, pages: { [pageName: string]: PageNEW }) => {
    const isActivePage = (sectionCode: string, pageNumber: number) =>
      current.sectionCode === sectionCode && current.page === pageNumber

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
          onClick: () => changePage(sectionCode, Number(number)),
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

  const isSectionDisabled = (index: number) => {
    const currentSection = Object.values(sections).findIndex(
      ({ details }) => details.code === current.sectionCode
    )
    return isLinear && currentSection < index
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
              <Header as="h4" disabled={isSectionDisabled(index)}>
                {title}
              </Header>
            </Grid.Column>
          </Grid>

          // OR:
          // <div>
          //   {progress && getIndicator(progress, stepNumber)}
          //   <Label basic disabled={isSectionDisabled(index)} content={title} />
          // </div>
        ),
      },
      onTitleClick: () => changePage(code, 1),
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
