import React from 'react'
import { Grid } from 'semantic-ui-react'
import PageButton from '../../components/Application/PageButton'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplateSectionPayload } from '../../utils/types'

interface ControlAreaProps {
  templateSections: TemplateSectionPayload[]
}

const ControlArea: React.FC<ControlAreaProps> = ({ templateSections }) => {
  const { query, push } = useRouter()
  const { serialNumber, sectionCode, page } = query

  const currentSection = templateSections.find(({ code }) => code === sectionCode)

  const isFirstPage = checkFirstPage({
    sectionCode: sectionCode as string,
    currentPage: Number(page),
    templateSections,
  })

  const isLastPage = checkLastPage({
    sectionCode: sectionCode as string,
    currentPage: Number(page),
    templateSections,
  })

  const changePageProps: changePageProps = {
    currentPage: Number(page),
    currentSection: currentSection as TemplateSectionPayload,
    templateSections,
    sendToPage: (section: string, page: number) =>
      push(`../../${serialNumber}/${section}/page${page}`),
    sendToSummary: () => push('../summary'),
  }

  return currentSection ? (
    <Grid columns={3}>
      <Grid.Row>
        <Grid.Column>
          {!isFirstPage && (
            <PageButton
              title="Previous"
              type="left"
              onClicked={() => previousButtonHandler(changePageProps)}
            />
          )}
        </Grid.Column>
        <Grid.Column />
        {/* Empty cell */}
        <Grid.Column>
          {!isLastPage ? (
            <PageButton
              title="Next"
              type="right"
              onClicked={() => nextPageButtonHandler(changePageProps)}
            />
          ) : (
            <PageButton
              title="Summary"
              type="right"
              onClicked={() => nextPageButtonHandler(changePageProps)}
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : null
}

interface checkPageProps {
  sectionCode: string
  currentPage: number
  templateSections: TemplateSectionPayload[]
}

function checkFirstPage({ sectionCode, currentPage, templateSections }: checkPageProps): boolean {
  const previousPage = currentPage - 1
  const currentSection = templateSections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return true
  }
  return previousPage > 0 ||
    (previousPage === 0 && templateSections.find(({ index }) => index === currentSection.index - 1))
    ? false
    : true
}

function checkLastPage({ sectionCode, currentPage, templateSections }: checkPageProps): boolean {
  const nextPage = currentPage + 1
  const currentSection = templateSections.find(({ code }) => code === sectionCode)
  if (!currentSection) {
    console.log('Problem to find currentSection!')
    return true
  }
  return nextPage <= currentSection.totalPages ||
    (nextPage > currentSection.totalPages &&
      templateSections.find(({ index }) => index === currentSection.index + 1))
    ? false
    : true
}

interface changePageProps {
  currentPage: number
  currentSection: TemplateSectionPayload
  templateSections: TemplateSectionPayload[]
  sendToPage: (section: string, page: number) => void
  sendToSummary: () => void
}

function previousButtonHandler({
  currentPage,
  currentSection,
  templateSections,
  sendToPage,
}: changePageProps) {
  const previousPage = currentPage - 1

  if (previousPage === 0) {
    // Will check if previous page is in a other section
    const foundSection = templateSections.find(({ index }) => index === currentSection.index - 1)
    foundSection
      ? sendToPage(foundSection.code, foundSection.totalPages)
      : console.log('Problem to load previous page (not found)!')
  } else sendToPage(currentSection.code, previousPage)
}

function nextPageButtonHandler({
  currentPage,
  currentSection,
  templateSections,
  sendToPage,
  sendToSummary,
}: changePageProps) {
  const nextPage = currentPage + 1
  // TODO: Validation
  if (nextPage > currentSection.totalPages) {
    // Will check if next page is in other section
    const foundSection = templateSections.find(({ index }) => index === currentSection.index + 1)
    foundSection ? sendToPage(foundSection.code, 1) : sendToSummary()
  } else sendToPage(currentSection.code, nextPage)
}

export default ControlArea
