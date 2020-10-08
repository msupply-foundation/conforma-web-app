import React from 'react'
import ApplicationCreate from './ApplicationCreate'
import TemplateSelect from '../../components/Template/TemplateSelect'
import { useRouter } from '../../hooks/useRouter'
import {
  Application,
  useCreateApplicationMutation,
  useCreateSectionMutation,
} from '../../generated/graphql'

const ApplicationNew: React.FC = () => {
  const { query } = useRouter()
  const { type } = query

  const [createApplicationMutation] = useCreateApplicationMutation()
  const createApplication = async (
    serialNumber: string,
    templateId: number,
    templateName: string,
    sectionIds: number[]
  ) => {
    try {
      const { data } = await createApplicationMutation({
        variables: {
          name: `Test application of ${templateName}`,
          serial: Number(serialNumber),
          templateId: templateId,
        },
      })

      if (!data || !data.createApplication || !data.createApplication.application) {
        console.log('Problemn to create applicatiion')
      } else createApplicationSections(data.createApplication.application, sectionIds)
    } catch (error) {
      console.error(error)
    }
  }

  const [createSectionMutation] = useCreateSectionMutation()
  const createApplicationSections = async (
    application: Pick<Application, 'id' | 'name'>,
    sectionIds: number[]
  ) => {
    try {
      sectionIds.forEach(async (sectionId) => {
        const sections = await createSectionMutation({
          variables: {
            applicationId: application.id,
            templateSectionId: sectionId,
          },
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateApplication = (
    serialNumber: string,
    templateId: number,
    templateName: string,
    sectionIds: number[]
  ) => {
    if (serialNumber != '' && templateId && templateName != '' && sectionIds.length > 0) {
      createApplication(serialNumber, templateId, templateName, sectionIds)
    } else {
      alert('Invalid template details')
    }
  }

  return type ? (
    <ApplicationCreate type={type} handleClick={handleCreateApplication} />
  ) : (
    <TemplateSelect />
  )
}

export default ApplicationNew
