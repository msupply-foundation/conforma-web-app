import React, { useEffect } from 'react'
import { useTemplateState } from '../../contexts/TemplateState'
import {
  Template,
  TemplateElementsConnection,
  TemplateSection,
  useGetTemplateQuery,
} from '../../utils/generated/graphql'
import { ApplicationPayload } from '../../utils/types'
import ApplicationStart from '../../components/Application/ApplicationStart'
import Loading from '../../components/Loading'

interface ApplicationCreateProps {
  type: string
  handleClick: (application: ApplicationPayload) => void
}

const ApplicationCreate: React.FC<ApplicationCreateProps> = (props) => {
  const { templateState, setTemplateState } = useTemplateState()
  const { type: templateType, sections } = templateState
  const { type, handleClick } = props

  const { data, loading, error } = useGetTemplateQuery({ variables: { code: type } })

  useEffect(() => {
    if (data && data.templates && data.templates.nodes) {
      if (data.templates.nodes.length > 1)
        console.log('More than one template returned. Only one expected!')

      // Send the template to the local state
      const template = data.templates.nodes[0] as Template
      const { id, code, name } = template
      const templateName = name ? name : 'Undefined name'
      const nextType = {
        id,
        code,
        name: templateName,
        description: 'TODO, Some description about this template',
        documents: Array<string>(),
      }
      setTemplateState({ type: 'setTemplate', nextType })

      // Send the template sections to the local state
      if (template.templateSections && template.templateSections.nodes) {
        if (template.templateSections.nodes.length === 0)
          console.log('No Section on the template returned. At least one expected!')
        else {
          const nextSections = template.templateSections.nodes.map((section) => {
            const { id, code, title } = section as TemplateSection
            const sectionCode = code ? code : 'Undefined code'
            const sectionTitle = title ? title : 'Undefined title'
            const {
              totalCount,
            } = section?.templateElementsBySectionId as TemplateElementsConnection
            return { id, code: sectionCode, title: sectionTitle, elementsCount: totalCount }
          })
          setTemplateState({ type: 'setTemplateSections', nextSections })
        }
      }
    }
  }, [data, error])

  // TODO: New issue to generate serial - should be done in server?
  const serialNumber = Math.round(Math.random() * 10000).toString()

  return loading ? (
    <Loading />
  ) : (
    templateType && sections && (
      <ApplicationStart
        type={templateType}
        sections={sections}
        handleClick={() =>
          handleClick(
            { serialNumber,
              templateId: templateType.id,
              templateName: templateType.name }
          )
        }
        serialNumber={serialNumber}
      />
    )
  )
}

export default ApplicationCreate
