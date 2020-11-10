import React from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import useGetResponsesAndElementState from '../../utils/hooks/useGetResponsesAndElementState'
import { ElementsBox, NavigationBox } from './'

const ApplicationPageWrapper: React.FC = () => {
  const { query } = useRouter()
  const { serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections } = useLoadApplication({
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
  })

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  return error ? (
    <Label content="Problem to load application" error={error} />
  ) : loading || responsesLoading ? (
    <Loading />
  ) : application && templateSections && serialNumber && currentSection ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          <ProgressBar
            serialNumber={serialNumber}
            sectionPage={{ sectionIndex: currentSection.index, currentPage: Number(page) }}
            templateSections={templateSections}
          />
        </Grid.Column>
        <Grid.Column width={12} stretched>
          <ElementsBox
            applicationId={application.id}
            sectionTitle={currentSection.title}
            sectionTemplateId={currentSection.id}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode}
            responsesFullByCode={responsesFullByCode}
            elementsState={elementsState}
          />
          <NavigationBox templateSections={templateSections} />
        </Grid.Column>
      </Grid>
    </Segment.Group>
  ) : (
    <Label content="Application's section can't be displayed" />
  )
}

export default ApplicationPageWrapper
