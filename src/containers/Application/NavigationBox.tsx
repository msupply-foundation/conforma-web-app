import React, { useState } from 'react'
import { Button, Container, Label, ModalProps } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplateSectionPayload } from '../../utils/types'
import messages from '../../utils/messages'
import strings from '../../utils/constants'

interface NavigationBoxProps {
  templateSections: TemplateSectionPayload[]
  currentSection: TemplateSectionPayload
  serialNumber: string
  currentPage: number
  validatePreviousPage: (sectionCode: string, page: number) => boolean
  showValidationModal: Function
  modalState: { showModal: ModalProps; setShowModal: Function }
}

const NavigationBox: React.FC<NavigationBoxProps> = ({
  templateSections,
  currentSection,
  serialNumber,
  currentPage,
  validatePreviousPage,
  modalState: { setShowModal },
}) => {
  const nextSection = templateSections.find(({ index }) => index === currentSection.index + 1)
  const previousSection = templateSections.find(({ index }) => index === currentSection.index - 1)

  const isFirstPage = currentPage - 1 === 0 && !previousSection
  const isLastPage = currentPage + 1 > currentSection.totalPages && !nextSection

  const { push } = useRouter()
  const sendToPage = (section: string, page: number) =>
    push(`/application/${serialNumber}/${section}/Page${page}`)

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
    // Get the next page and section
    const nextPage = currentPage + 1
    const section = nextPage > currentSection.totalPages ? nextSection : currentSection
    if (!section) {
      console.log('Problem to load next page (not found)!')
      return
    }
    const page = nextPage > currentSection.totalPages ? 1 : nextPage

    // Check if previous page (related to next) is valid
    const status = validatePreviousPage(section.code, page)

    if (!status) setShowModal({ open: true, ...messages.VALIDATION_FAIL })
    else sendToPage(section.code, page)
  }

  return (
    <Container>
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

export default NavigationBox
