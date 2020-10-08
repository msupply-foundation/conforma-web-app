import React, { useEffect } from 'react'
import { useRouter } from '../../hooks/useRouter'
import {
  ApplicationHeader,
  ApplicationSummary,
  ApplicationStep,
} from '../../components/Application'
import {
  Application,
  ApplicationSection,
  TemplateSection,
  useGetApplicationQuery,
} from '../../generated/graphql'
import { useApplicationState } from '../../contexts/ApplicationState'
import { Container } from 'semantic-ui-react'
import Loading from '../../components/Loading'

type TParams = { serialNumber: string; sectionName: string; page: string }
export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { name, serial } = applicationState
  const { summary } = props
  const { query } = useRouter()
  const { mode, serialNumber, sectionName, page } = query

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: Number(serialNumber),
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      if (data.applications.nodes.length > 1)
        console.log('More than one applicstion returned. Only one expected!')
      const application = data.applications.nodes[0] as Application
      if (application.template) {
        setApplicationState({
          type: 'setApplication',
          nextName: application.name as string,
          nextSerial: application.serial as number,
          nextTempId: application.template.id,
        })

        if (
          application.template.templateSections &&
          application.template.templateSections.nodes &&
          application.applicationSections &&
          application.applicationSections.nodes
        ) {
          application.template.templateSections.nodes.forEach((sectionTemplate) => {
            const {
              code,
              title,
              id: templateId,
              templateElementsBySectionId: elements,
            } = sectionTemplate as TemplateSection
            const sections = application.applicationSections.nodes as ApplicationSection[]
            const section = sections.find(({ templateSectionId }) =>
              templateSectionId && templateId ? templateSectionId === templateId : false
            )

            if (!section) console.log('Section matching template not found!')
            else {
              setApplicationState({
                type: 'setSection',
                newSection: {
                  id: section.id,
                  code: code as string,
                  title: title as string,
                  templateId,
                },
              })
            }
          })
        }
      }
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : summary ? (
    <ApplicationSummary />
  ) : (
    <Container>
      {serial && name && (
        <ApplicationHeader mode={mode} serialNumber={serial.toString()} name={name} />
      )}
      {sectionName && page && <ApplicationStep />}
    </Container>
  )
}

export default ApplicationPage
