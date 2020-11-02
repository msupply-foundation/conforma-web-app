import React from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import ElementsBox from './ElementsBox'
import NavigationBox from './NavigationBox'

const ApplicationPage: React.FC = () => {
  const { query } = useRouter()
  const { serialNumber, sectionCode, page } = query

  const { error, loading, application, templateSections } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  // const { responsesByCode } = useGetResponsesByCode({ serialNumber: serialNumber as string })

  return error ? (
    <Label content="Problem to load application" error={error} />
  ) : loading ? (
    <Loading />
  ) : application && templateSections && serialNumber && currentSection ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={5}>
          <ProgressBar templateSections={templateSections} />
        </Grid.Column>
        <Grid.Column width={11} stretched>
          <ElementsBox
            applicationId={application.id}
            sectionTitle={currentSection.title}
            sectionTemplateId={currentSection.id}
            sectionPage={Number(page)}
          />
          <NavigationBox templateSections={templateSections} />
        </Grid.Column>
      </Grid>
    </Segment.Group>
  ) : (
    <Label content="Application's section can't be displayed" />
  )
}

export default ApplicationPage
