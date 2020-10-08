import React, { useEffect } from 'react'
import ApplicationCreate from './ApplicationCreate'
import TemplateSelect from '../../components/Template/TemplateSelect'
import { useRouter } from '../../hooks/useRouter'
import {
  Application,
  useCreateApplicationMutation,
  useCreateSectionMutation,
} from '../../generated/graphql'

interface ApplicationPayload {
  serialNumber: string
  templateId: number
  templateName: string
}

interface SectionPayload {
  applicationId: number
  templateSections: number[]
}

const ApplicationNew: React.FC = () => {
  const { query } = useRouter()
  const { type } = query

  const [createApplicationMutation] = useCreateApplicationMutation({
    onCompleted: ({ createApplication }) => {
      if (createApplication) {
        const application = createApplication.application as Application
        if (application.template && application.template.templateSections.nodes) {
          const sections = application.template.templateSections.nodes.map((section) =>
            section ? section.id : -1
          )
          console.log(`Success to create application ${application.serial}!`)
          generateApplicationSections({ applicationId: application.id, templateSections: sections })
        } else console.log('Create application failed - no sections!')
      } else console.log('Create application failed - no data!')
    },
  })
  const [createSectionMutation] = useCreateSectionMutation({
    onCompleted: ({ createApplicationSection }) => {
      if (createApplicationSection && createApplicationSection.applicationSection) {
        if (createApplicationSection.applicationSection.templateSection) {
          console.log('Success to create application sections!')
        } else console.log('Create application section failed - no template sections!')
      } else console.log('Create application section failed - no data!')
    },
  })

  const generateApplication = (payload: ApplicationPayload) => {
    const { serialNumber, templateId, templateName } = payload
    try {
      const data = createApplicationMutation({
        variables: {
          name: `Test application of ${templateName}`,
          serial: Number(serialNumber),
          templateId: templateId,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const generateApplicationSections = (payload: SectionPayload) => {
    const { applicationId, templateSections } = payload
    try {
      templateSections.forEach((sectionId) => {
        createSectionMutation({
          variables: {
            applicationId,
            templateSectionId: sectionId,
          },
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateApplication = async (
    serialNumber: string,
    templateId: number,
    templateName: string
  ) => {
    if (serialNumber != '' && templateId && templateName != '') {
      generateApplication({ serialNumber, templateId, templateName })
    } else {
      alert('Create application failed - payload!')
    }
  }

  return type ? (
    <ApplicationCreate type={type} handleClick={handleCreateApplication} />
  ) : (
    <TemplateSelect />
  )
}

export default ApplicationNew
