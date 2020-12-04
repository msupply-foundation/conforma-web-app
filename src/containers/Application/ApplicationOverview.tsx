import React, { useEffect, useState } from 'react'
import { Button, Container, Form, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { SectionSummary, Loading } from '../../components'
import getPageElements from '../../utils/helpers/getPageElements'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'
import { SectionElementStates } from '../../utils/types'

const ApplicationOverview: React.FC = () => {
  const [sectionsPages, setSectionsAndElements] = useState<SectionElementStates[]>()

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

  const {
    error: submitError,
    processing,
    submitted,
    submit,
    isStrictValidation,
  } = useUpdateApplication({
    applicationSerial: serialNumber as string,
  })

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
  ) : serialNumber && appStatus && sectionsPages ? (
    <Container>
      <Header as="h1" content="REVIEW AND SUBMIT" />
      <Form>
        {sectionsPages.map((sectionPages) => (
          <SectionSummary
            key={`SecSummary_${sectionPages.section.code}`}
            sectionPages={sectionPages}
            serialNumber={serialNumber}
            allResponses={responsesByCode || {}}
            isStrictValidation={isStrictValidation}
            canEdit={appStatus.status === 'DRAFT'}
          />
        ))}
        {appStatus.status === 'DRAFT' ? (
          <Button content="Submit application" onClick={() => submit()} />
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
