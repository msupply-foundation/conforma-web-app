import React, { useEffect } from 'react'
import { useRouter } from '../../hooks/useRouter'
import { useTemplateState, TemplateType, Section } from '../../contexts/TemplateState'
import {
  Application,
  Template,
  TemplateElementsConnection,
  TemplateSection,
  useGetTemplateQuery,
  useCreateApplicationMutation,
  useCreateSectionMutation,
} from '../../generated/graphql'
import ApplicationCreate from '../../components/Application/ApplicationCreate'
import TemplateSelect from '../../components/Template/TemplateSelect'

const ApplicationNew: React.FC = () => {
  const { query } = useRouter()
  const { type } = query
  const { templateState, setTemplateState } = useTemplateState()
  const { type: templateType, sections } = templateState

  console.log('type', type)

  // if (type) {
  //   const { data, loading, error } = useGetTemplateQuery({ variables: { code: type } })

  //   useEffect(() => {
  //     if (data && data.templates && data.templates.nodes) {
  //       if (data.templates.nodes.length > 1)
  //         console.log('More than one template returned. Only one expected!')

  //       // Send the template to the local state
  //       const template = data.templates.nodes[0] as Template
  //       const { id, code, name } = template
  //       const templateName = name ? name : 'Undefined name'
  //       const nextType = {
  //         id,
  //         code,
  //         name: templateName,
  //         description: 'TODO, Some description about this template',
  //         documents: Array<string>(),
  //       }
  //       setTemplateState({ type: 'setTemplate', nextType })

  //       // Send the template sections to the local state
  //       if (template.templateSections && template.templateSections.nodes) {
  //         if (template.templateSections.nodes.length === 0)
  //           console.log('No Section on the template returned. At least one expected!')
  //         else {
  //           const nextSections = template.templateSections.nodes.map((section) => {
  //             const { id, code, title } = section as TemplateSection
  //             const sectionCode = code ? code : 'Undefined code'
  //             const sectionTitle = title ? title : 'Undefined title'
  //             const {
  //               totalCount,
  //             } = section?.templateElementsBySectionId as TemplateElementsConnection
  //             return { id, code: sectionCode, title: sectionTitle, elementsCount: totalCount }
  //           })
  //           setTemplateState({ type: 'setTemplateSections', nextSections })
  //         }
  //       }
  //     }
  //   }, [data, error])
  // }

  // const [createApplicationMutation] = useCreateApplicationMutation()
  // const createApplication = async (
  //   serialNumber: string,
  //   template: TemplateType,
  //   sections: Section[]
  // ) => {
  //   try {
  //     const { data } = await createApplicationMutation({
  //       variables: {
  //         name: `Test application of ${template.name}`,
  //         serial: Number(serialNumber),
  //         templateId: template.id,
  //       },
  //     })

  //     if (!data || !data.createApplication || !data.createApplication.application) {
  //       console.log('Problemn to create applicatiion')
  //     } else createApplicationSections(data.createApplication.application, sections)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // const [createSectionMutation] = useCreateSectionMutation()
  // const createApplicationSections = async (
  //   application: Pick<Application, 'id' | 'name'>,
  //   sections: Section[]
  // ) => {
  //   try {
  //     sections.forEach(async (section) => {
  //       const sections = await createSectionMutation({
  //         variables: {
  //           applicationId: application.id,
  //           templateSectionId: section.id,
  //         },
  //       })
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handleCreateApplication = (serialNumber: string) => {
    if (templateType && templateType.id && templateType.name != '' && sections) {
      // createApplication(serialNumber, templateType, sections)
      alert('TODO: createMutation')
    } else {
      alert('Invalid template details')
    }
  }

  return type ? (
    <ApplicationCreate
      type={templateType}
      sections={sections}
      handleClick={handleCreateApplication}
      serialNumber={Math.round(Math.random() * 10000).toString()} // TODO: New issue to generate serial - should be done in server?
    />
  ) : (
    <TemplateSelect />
  )
}

export default ApplicationNew
