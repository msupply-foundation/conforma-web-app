import React, { useState } from 'react'
import { Button, Grid, Header, Icon, Message, Modal } from 'semantic-ui-react'
import PageButton from '../../components/Application/PageButton'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplateSectionPayload } from '../../utils/types'
import { VALIDATION_FAIL } from '../../utils/messages'

interface NavigationBoxProps {
  templateSections: TemplateSectionPayload[]
  validateCurrentPage: () => boolean
}

interface ModalProps {
  open: boolean
  message: string
  title: string
}

const NavigationBox: React.FC<NavigationBoxProps> = ({ templateSections, validateCurrentPage }) => {
  const [showModal, setShowModal] = useState<ModalProps>({
    open: false,
    message: '',
    title: '',
  })
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
      push(`/application/${serialNumber}/${section}/Page${page}`),
    sendToSummary: () => push(`/application/${serialNumber}/summary`),
    validateCurrentPage,
  }

  return currentSection ? (
    <>
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
            <PageButton
              title={isLastPage ? 'Summary' : 'Next'}
              type="right"
              onClicked={() => {
                if (!nextPageButtonHandler(changePageProps)) {
                  setShowModal({ open: true, ...VALIDATION_FAIL })
                }
              }}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {showValidationModal(showModal, setShowModal)}
      {/* {showMessage !== '' ? showValidationModal(showMessage) : null} */}
    </>
  ) : null
}

const modalInitialValue: ModalProps = {
  open: false,
  message: '',
  title: '',
}

function showValidationModal(showModal: ModalProps, setShowModal: Function) {
  return (
    <Modal basic onClose={() => setShowModal(modalInitialValue)} open={showModal.open} size="small">
      <Header icon>
        <Icon name="exclamation triangle" />
        {showModal.title}
      </Header>
      <Modal.Content>
        <p>{showModal.message}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button color="green" inverted onClick={() => setShowModal(modalInitialValue)}>
          <Icon name="checkmark" /> Yes
        </Button>
      </Modal.Actions>
    </Modal>
  )
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
  validateCurrentPage: () => boolean
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
  validateCurrentPage,
}: changePageProps): boolean {
  // Run the validation on the current page
  const status = validateCurrentPage()
  if (!status) return false
  const nextPage = currentPage + 1
  if (nextPage > currentSection.totalPages) {
    // Will check if next page is in other section
    const foundSection = templateSections.find(({ index }) => index === currentSection.index + 1)
    foundSection ? sendToPage(foundSection.code, 1) : sendToSummary()
  } else sendToPage(currentSection.code, nextPage)
  return true
}

export default NavigationBox
