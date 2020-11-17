import React, { useEffect, useState } from 'react'
import { Container, Header, Loader, Message, Modal } from 'semantic-ui-react'
import { ApplicationSummary, Loading } from '../../components'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import useUpdateApplication from '../../utils/hooks/useUpdateApplication'
import { SectionElementStates } from '../../utils/types'

const ApplicationOverview: React.FC = () => {
  const [elementsInSections, setElementsInSections] = useState<SectionElementStates[]>()
  const { query, push } = useRouter()
  const { serialNumber } = query

  const { error, loading, templateSections, isReady } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    responsesFullByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber: serialNumber as string,
    isReady,
  })

  const { error: submitError, processing, submitted, submit } = useUpdateApplication({
    applicationSerial: serialNumber as string,
  })

  useEffect(() => {
    if (!responsesLoading && elementsState && responsesFullByCode) {
      // Create the arary of sections with array of section's element & responses
      const sectionsAndElements: SectionElementStates[] = templateSections
        .sort((a, b) => a.index - b.index)
        .map((section) => {
          return { section, elements: [] }
        })

      Object.values(elementsState).forEach((element) => {
        const response = responsesFullByCode[element.code]
        const elementAndValue = { element, value: response ? response : null }
        sectionsAndElements[element.section].elements.push(elementAndValue)
      })
      setElementsInSections(sectionsAndElements)
    }
  }, [elementsState, responsesLoading])

  return error ? (
    <Message error header="Problem to load application overview" list={[error]} />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : submitError ? (
    <Message error header="Problem to submit application" list={[submitError]} />
  ) : serialNumber && elementsInSections ? (
    <Container>
      <ApplicationSummary
        sectionsAndElements={elementsInSections}
        onSubmitHandler={() => submit()}
      />
      {showProcessingModal(processing, submitted)}
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
