import React, { useState, useEffect } from 'react'
import { Button, Container, Label, ModalProps } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useApplicationState } from '../../contexts/ApplicationState'
import { TemplateSectionPayload } from '../../utils/types'
import messages from '../../utils/messages'
import strings from '../../utils/constants'

interface NavigationBoxProps {
  templateSections: TemplateSectionPayload[]
  currentSection: TemplateSectionPayload
  serialNumber: string
  currentPage: number
  validateCurrentPage: () => boolean
  showValidationModal: Function
  modalState: { showModal: ModalProps; setShowModal: Function }
}

const NavigationBox: React.FC<NavigationBoxProps> = (props) => {
  const { templateSections, currentSection, serialNumber, currentPage, validateCurrentPage } = props
  const { showModal, setShowModal } = props.modalState
  const {
    applicationState: {
      inputElementsActivity: { areTimestampsInSequence },
    },
  } = useApplicationState()
  const [nextButtonClicked, setNextButtonClicked] = useState(false)
  const nextSection = templateSections.find(({ index }) => index === currentSection.index + 1)
  const previousSection = templateSections.find(({ index }) => index === currentSection.index - 1)

  const isFirstPage = currentPage - 1 === 0 && !previousSection
  const isLastPage = currentPage + 1 > currentSection.totalPages && !nextSection

  const { push } = useRouter()
  const sendToPage = (section: string, page: number) => {
    setNextButtonClicked(false)
    push(`/application/${serialNumber}/${section}/Page${page}`)
  }

  const previousButtonHandler = (_: any) => {
    const previousPage = currentPage - 1
    if (previousPage === 0) {
      // Will check if previous page is in a other section
      previousSection
        ? sendToPage(previousSection.code, previousSection.totalPages)
        : console.log('Problem to load previous page (not found)!')
    } else sendToPage(currentSection.code, previousPage)
  }

  const nextPageButtonHandler = async () => {
    // Run the validation on the current page
    const status = validateCurrentPage()
    if (!status) {
      setShowModal({ open: true, ...messages.VALIDATION_FAIL })
      setNextButtonClicked(false)
      return
    }
    const nextPage = currentPage + 1
    if (nextPage > currentSection.totalPages) {
      // Will check if next page is in other section
      nextSection
        ? sendToPage(nextSection.code, 1)
        : console.log('Problem to load next page (not found)!')
    } else sendToPage(currentSection.code, nextPage)
  }

  // Make sure all responses are up-to-date (areTimestampsInSequence)
  // and only proceed when button is clicked AND responses are ready
  useEffect(() => {
    if (areTimestampsInSequence && nextButtonClicked) {
      nextPageButtonHandler()
    }
  }, [areTimestampsInSequence, nextButtonClicked])

  return (
    <Container>
      {!isFirstPage && (
        <Label basic as="a" onClick={previousButtonHandler}>
          {strings.BUTTON_PREVIOUS}
        </Label>
      )}
      {!isLastPage && (
        <Label basic as="a" onClick={() => setNextButtonClicked(true)}>
          {strings.BUTTON_NEXT}
        </Label>
      )}
    </Container>
  )
}

export default NavigationBox
