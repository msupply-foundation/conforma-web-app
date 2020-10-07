import React, { useEffect } from 'react'
import { useNavigationState } from '../Main/NavigationState'
import { useTemplateState, TemplateType, Section } from './TemplateState'
import { useApplicationState } from './ApplicationState'
import {
  Application,
  Template,
  TemplateElementsConnection,
  TemplateSection,
  // TemplateStage,
  useGetTemplateQuery,
  useCreateApplicationMutation,
  useCreateSectionMutation,
} from '../../generated/graphql'
import ApplicationCreate from '../../components/Application/ApplicationCreate'

const ApplicationNew: React.FC = () => {
  const { navigationState, setNavigationState } = useNavigationState()
  const { type } = navigationState.queryParameters
  const { templateState, setTemplateState } = useTemplateState()
  const { type: templateType, sections } = templateState

  const { data, loading, error } = useGetTemplateQuery({ variables: { code: type } })

  useEffect(() => {
    if (data && data.templates && data.templates.nodes) {
      if (data.templates.nodes.length > 1)
        console.log('More than one template returned. Only one expected!')

      // Set the main template in the local state
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

      // // Set the template stages in the local state
      // if (template.templateStages && template.templateStages.nodes) {
      //   const nextStages = template.templateStages.nodes.map((stage) => {
      //     const { id, title } = stage as TemplateStage
      //     const stageTitle = title ? title : 'Untitle stage'

      //     return { id, title: stageTitle }
      //   })
      //   setTemplateState({ type: 'setTemplateStages', nextStages })
      // }

      // Set the template sections in the local state
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

  const [createApplicationMutation] = useCreateApplicationMutation()
  const createApplication = async (template: TemplateType, sections: Section[]) => {
    try {
      const { data } = await createApplicationMutation({
        variables: {
          name: `Test application of ${template.name}`,
          serial: Math.round(Math.random() * 10000),
          templateId: template.id,
        },
      })

      if (!data || !data.createApplication || !data.createApplication.application) {
        console.log('Problemn to create applicatiion')
      } else createApplicationSections(data.createApplication.application, sections)
    } catch (error) {
      console.error(error)
    }
  }

  const [createSectionMutation] = useCreateSectionMutation()
  const createApplicationSections = async (
    application: Pick<Application, 'id' | 'name'>,
    sections: Section[]
  ) => {
    try {
      sections.forEach(async (section) => {
        const sections = await createSectionMutation({
          variables: {
            applicationId: application.id,
            templateSectionId: section.id,
          },
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateApplication = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (templateType && templateType.id && templateType.name != '' && sections) {
      createApplication(templateType, sections)
    } else {
      alert('Invalid template details')
    }
  }

  return (
    <ApplicationCreate
      type={templateType}
      sections={sections}
      handleOnClick={handleCreateApplication}
    />
  )
}

export default ApplicationNew
