import React, { useState } from 'react'
import { Button, Container, Header, Icon, Label, Modal } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplateSectionPayload } from '../../utils/types'
import { VALIDATION_FAIL } from '../../utils/messages'
import strings from '../../utils/constants'

interface NavigationBoxProps {
  templateSections: TemplateSectionPayload[]
  currentSection: TemplateSectionPayload
  serialNumber: string
  currentPage: number
  validateCurrentPage: () => boolean
}

interface ModalProps {
  open: boolean
  message: string
  title: string
}

const NavigationBox: React.FC<NavigationBoxProps> = (props) => {
  const { templateSections, currentSection, serialNumber, currentPage, validateCurrentPage } = props
  const [showModal, setShowModal] = useState<ModalProps>({
    open: false,
    message: '',
    title: '',
  })

  const nextSection = templateSections.find(({ index }) => index === currentSection.index + 1)
  const previousSection = templateSections.find(({ index }) => index === currentSection.index - 1)

  const isFirstPage = currentPage - 1 === 0 && !previousSection
  const isLastPage = currentPage + 1 > currentSection.totalPages && !nextSection

  const { push } = useRouter()
  const sendToPage = (section: string, page: number) =>
    push(`/applications/${serialNumber}/${section}/Page${page}`)

  const previousButtonHandler = (_: any) => {
    const previousPage = currentPage - 1
    if (previousPage === 0) {
      // Will check if previous page is in a other section
      previousSection
        ? sendToPage(previousSection.code, previousSection.totalPages)
        : console.log('Problem to load previous page (not found)!')
    } else sendToPage(currentSection.code, previousPage)
  }

  const nextPageButtonHandler = (_: any): void => {
    // Run the validation on the current page
    const status = validateCurrentPage()
    if (!status) {
      setShowModal({ open: true, ...VALIDATION_FAIL })
      return
    }
    const nextPage = currentPage + 1
    if (nextPage > currentSection.totalPages) {
      // Will check if next page is in other section
      nextSection
        ? sendToPage(nextSection.code, nextSection.totalPages)
        : console.log('Problem to load next page (not found)!')
    } else sendToPage(currentSection.code, nextPage)
  }

  return (
    <Container>
      {showValidationModal(showModal, setShowModal)}
      {!isFirstPage && (
        <Label basic as="a" onClick={previousButtonHandler}>
          {strings.BUTTON_PREVIOUS}
        </Label>
      )}
      {!isLastPage && (
        <Label basic as="a" onClick={nextPageButtonHandler}>
          {strings.BUTTON_NEXT}
        </Label>
      )}
    </Container>
  )
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

export default NavigationBox
