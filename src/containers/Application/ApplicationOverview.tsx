import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { SectionSummary, Loading } from '../../components'
import getPageElements from '../../utils/helpers/getPageElements'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'
import {
  ApplicationElementStates,
  ResponseFull,
  ResponsesByCode,
  SectionElementStates,
} from '../../utils/types'
import { revalidateAll } from '../../utils/helpers/revalidateAll'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'

const ApplicationOverview: React.FC = () => {
  const [sectionsPages, setSectionsAndElements] = useState<SectionElementStates[]>()
  const [isRevalidated, setIsRevalidated] = useState(false)

  const { query, push } = useRouter()
  const { serialNumber } = query
  const { error, loading, templateSections, isApplicationLoaded, appStatus } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isApplicationLoaded,
  })

  const { error: submitError, processing, submitted, submit } = useUpdateApplication({
    applicationSerial: serialNumber as string,
  })

  const [responseMutation] = useUpdateResponseMutation()

  useEffect(() => {
    // Fully re-validate on page load
    console.log('Loaded?', isApplicationLoaded)
    if (isApplicationLoaded && elementsState && responsesByCode) {
      console.log('Responses', responsesByCode)
      console.log('elementsState', elementsState)
      revalidateAll(elementsState, responsesByCode).then((result) => {
        console.log('Revalidation', result)
        if (result.validityChanges) {
          // Update database if validity changed
          result.validityChanges.forEach((changedElement) => {
            responseMutation({
              variables: {
                id: changedElement.id,
                isValid: changedElement.isValid,
              },
            })
          })
        }
        // If invalid responses, re-direct to first invalid page
        if (!result.allValid) {
          const { firstErrorSectionIndex, firstErrorPage } = getFirstErrorLocation(
            responsesByCode,
            elementsState
          )
          push(`/application/${serialNumber}/S${firstErrorSectionIndex + 1}/Page${firstErrorPage}`)
        }
      })
      setIsRevalidated(true)
    }
  }, [responsesByCode, elementsState])

  useEffect(() => {
    if (!responsesLoading && elementsState && responsesByCode) {
      // Create the sections and pages structure to display each section's element & responses
      const sectionsAndElements: SectionElementStates[] = templateSections
        .sort((a, b) => a.index - b.index)
        .map((section) => {
          const sectionDetails = {
            title: section.title,
            code: section.code,
          }
          const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
          const pages = pageNumbers.reduce((pages, pageNumber) => {
            const elements = getPageElements({
              elementsState,
              sectionIndex: section.index,
              pageNumber,
            })
            if (elements.length === 0) return pages
            const elementsAndResponses = elements.map((element) => ({
              element,
              response: responsesByCode[element.code],
            }))
            const pageName = `Page ${pageNumber}`
            return { ...pages, [pageName]: elementsAndResponses }
          }, {})
          return { section: sectionDetails, pages }
        })

      setSectionsAndElements(sectionsAndElements)
    }
  }, [elementsState, responsesLoading])

  return error ? (
    <Message error header="Problem to load application overview" list={[error]} />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : submitError ? (
    <Message error header="Problem to submit application" list={[submitError]} />
  ) : serialNumber && appStatus && sectionsPages && isRevalidated ? (
    <Container>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {sectionsPages.map((sectionPages) => (
          <SectionSummary
            key={`SecSummary_${sectionPages.section.code}`}
            sectionPages={sectionPages}
            serialNumber={serialNumber}
            allResponses={responsesByCode || {}}
            canEdit={appStatus.status === 'DRAFT'}
          />
        ))}
        {appStatus.status === 'DRAFT' ? (
          <Button content={strings.BUTTON_SUMMARY} onClick={() => submit()} />
        ) : null}
        {showProcessingModal(processing, submitted)}
      </Form>
    </Container>
  ) : (
    <Message error header="Problem to load application overview" />
  )
}

const showProcessingModal = (processing: boolean, submitted: boolean) => {
  return processing ? (
    <Modal basic open={processing} size="mini">
      <Modal.Header>Please wait...</Modal.Header>
      <Modal.Content>
        <Loader>Application is being submitted to the server</Loader>
      </Modal.Content>
    </Modal>
  ) : submitted ? (
    <Container text>
      <Header>Application submitted!</Header>
    </Container>
  ) : null
}

export default ApplicationOverview

function getFirstErrorLocation(
  responses: ResponsesByCode,
  elementsState: ApplicationElementStates
) {
  let firstErrorSectionIndex = Infinity
  let firstErrorPage = Infinity
  Object.entries(responses).forEach(([code, response]) => {
    if (!response?.isValid && elementsState[code].category === 'QUESTION') {
      const sectionIndex = elementsState[code].sectionIndex
      const page = elementsState[code].page
      if (sectionIndex < firstErrorSectionIndex) {
        firstErrorSectionIndex = sectionIndex
        firstErrorPage = page
      } else
        firstErrorPage =
          sectionIndex === firstErrorSectionIndex && page < firstErrorPage ? page : firstErrorPage
    }
  })
  return { firstErrorPage, firstErrorSectionIndex }
}
