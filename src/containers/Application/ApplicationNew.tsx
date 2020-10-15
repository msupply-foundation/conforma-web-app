import React from 'react'
import ApplicationCreate from './ApplicationCreate'
import { ApplicationSelectType } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { Application,
  CreateApplicationMutation,
  CreateSectionMutation,
  useCreateApplicationMutation,
useCreateSectionMutation,
} from '../../utils/generated/graphql'
import { ApplicationPayload, SectionPayload, TemplatePayload } from '../../utils/types'
import getApplicationQuery from '../../utils/graphql/queries/getApplication.query'
import { useApplicationState } from '../../contexts/ApplicationState'

const ApplicationNew: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { query } = useRouter()
  const { type } = query
  
  const [createApplicationMutation] = useCreateApplicationMutation({
    onCompleted: (data: CreateApplicationMutation) => {
    onCreateApplicationCompleted(data, createSectionMutation)
  }})
  const [createSectionMutation] = useCreateSectionMutation({
    onCompleted: onCreateSectionsCompleted,
    // Update cached query of getApplication
    refetchQueries: [
      {
        query: getApplicationQuery,
        variables: { serial: Number(applicationState.serialNumber) },
      },
    ],
  })

  return type ? (
    <ApplicationCreate type={type} handleClick={(template: TemplatePayload) => {
       // TODO: New issue to generate serial - should be done in server?
      const serialNumber = Math.round(Math.random() * 10000)
      setApplicationState({type: 'setSerialNumber', serialNumber})
      handleCreateApplication(createApplicationMutation, {
        template,
        serialNumber 
      })}
    }/>
  ) : (
    <ApplicationSelectType />
  )
}

export default ApplicationNew

function handleCreateApplication (createApplicationMutation: any, payload: ApplicationPayload) {
  const { serialNumber, template } = payload
  try {
    createApplicationMutation({
      variables: {
        name: `Test application of ${template.name}`,
        serial: Number(serialNumber),
        templateId: template.id,
      }
    })
  } catch (error) {
    console.error(error)
  }
}

function onCreateApplicationCompleted ({createApplication}: CreateApplicationMutation, createSectionMutation: any) {
  if (createApplication) {
    const application = createApplication.application as Application
    if (application.template && application.template.templateSections.nodes) {
      const sections = application.template.templateSections.nodes.map((section) =>
        section ? section.id : -1
      )
      console.log(`Success to create application ${application.serial}!`)
      createApplicationSection({ applicationId: application.id, templateSections: sections }, createSectionMutation)
    } else console.log('Create application failed - no sections!')
  } else console.log('Create application failed - no data!')
}

function createApplicationSection (payload: SectionPayload, createSectionMutation: any) {
  const { applicationId, templateSections } = payload
  try {
    templateSections.forEach((sectionId) => {
      createSectionMutation({
        variables: {
          applicationId,
          templateSectionId: sectionId,
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}
  
function onCreateSectionsCompleted ({ createApplicationSection }: CreateSectionMutation) {
  if (
    createApplicationSection &&
    createApplicationSection.applicationSection &&
    createApplicationSection.applicationSection.templateSection
  ) {
    const section = createApplicationSection.applicationSection.templateSection
    console.log(`Success to create application section ${section.title}`)
  } else console.log('Create application section failed - no data!')
}