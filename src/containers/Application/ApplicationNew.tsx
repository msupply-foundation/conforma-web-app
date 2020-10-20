import React from 'react'
import ApplicationCreate from './ApplicationCreate'
import { ApplicationSelectType } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationPayload, TemplateTypePayload } from '../../utils/types'
import { useApplicationState } from '../../contexts/ApplicationState'
import useCreateApplication from '../../utils/hooks/useCreateApplication'

const ApplicationNew: React.FC = () => {
  const { setApplicationState } = useApplicationState()
  const { query } = useRouter()
  const { type } = query

  const { applicationMutation } = useCreateApplication()

  return type ? (
    <ApplicationCreate
      type={type}
      handleClick={(template: TemplateTypePayload) => {
        // TODO: New issue to generate serial - should be done in server?
        const serialNumber = Math.round(Math.random() * 10000).toString()
        setApplicationState({ type: 'setSerialNumber', serialNumber })
        handleCreateApplication(applicationMutation, {
          serialNumber,
          template,
        })
      }}
    />
  ) : (
    <ApplicationSelectType />
  )
}

function handleCreateApplication(applicationMutation: any, payload: ApplicationPayload) {
  const { serialNumber, template } = payload
  try {
    applicationMutation({
      variables: {
        name: `Test application of ${template.name}`,
        serial: serialNumber,
        templateId: template.id,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

export default ApplicationNew
