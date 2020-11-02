import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, ProgressBar } from '../../components'
import { Grid, Label, Segment } from 'semantic-ui-react'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { SectionProgressPayload, TemplateSectionPayload } from '../../utils/types'
import { useApplicationState } from '../../contexts/ApplicationState'
import ElementsArea from './ElementsArea'
import NavigationBox from './NavigationBox'

const ApplicationPage: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const [sectionProgress, setSectionProgress] = useState<SectionProgressPayload[] | undefined>()
  const { query } = useRouter()
  const { serialNumber, sectionCode, page } = query
  const { sections } = applicationState

  const { error, loading, application, templateSections } = useLoadApplication({
    serialNumber: serialNumber as string,
  })

  useEffect(() => {
    if (application && templateSections) {
      const sectionsProgress = templateSections.map((section) => {
        // Generate object for each page, based on totalPages of each section, returning one pages obj per section
        return Array.from(Array(section.totalPages).keys(), (n) => n + 1).reduce(
          (o, key) => Object.assign(o, { [key]: { valid: false, visited: false } }),
          {}
        )
      })
      setApplicationState({ type: 'setApplication', id: application.id, sectionsProgress })
    }
  }, [application, templateSections])

  const currentSection = templateSections.find(({ code }) => code == sectionCode)

  // const { responsesByCode } = useGetResponsesByCode({ serialNumber: serialNumber as string })

  const checkPagePayload = {
    sectionCode: sectionCode as string,
    currentPage: Number(page),
    sections: templateSections,
  }

  useEffect(() => {
    if (!sections) return
    const sectionsProgress = templateSections.map((templateSection) => {
      const { index } = templateSection
      return {
        templateSection,
        pages: sections && sections.length > index ? sections[index] : {},
      }
    })
    setSectionProgress(sectionsProgress)
  }, [sections])

  return error ? (
    <Label content="Problem to load application" error={error} />
  ) : loading ? (
    <Loading />
  ) : application && templateSections && sections && serialNumber && currentSection ? (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={5}>
          {sectionProgress && <ProgressBar sections={sectionProgress} />}
        </Grid.Column>
        <Grid.Column width={11} stretched>
          <ElementsArea
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
