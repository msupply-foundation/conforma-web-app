import { useEffect, useState } from 'react'
import { Template, TemplateSection, useGetTemplateQuery } from '../generated/graphql'
import { TemplateTypePayload, TemplateSectionPayload } from '../types'

interface useLoadTemplateProps {
  type: string
}

const useLoadTemplate = (props: useLoadTemplateProps) => {
  const { type } = props
  const [templateType, setType] = useState<TemplateTypePayload | null>(null)
  const [templateSections, setSections] = useState<TemplateSectionPayload[] | null>(null)

  const { data, loading, error } = useGetTemplateQuery({
    variables: {
      code: type,
    },
  })

  useEffect(() => {
    if (data?.templates) {
      if (data.templates.nodes.length === 0) return
      if (data.templates.nodes.length > 1)
        console.log('More than one template returned. Only one expected!')

      // Send the template to the local state
      const template = data.templates.nodes[0] as Template

      const { id, code, name } = template
      const templateType = {
        id,
        code,
        name: name ? name : 'Undefined name',
        description: 'Include some description for this template',
        documents: Array<string>(),
      }
      setType(templateType)

      // Send the template sections to the local state
      if (template.templateSections && template.templateSections.nodes) {
        if (template.templateSections.nodes.length === 0)
          console.log('No Section on the template returned. At least one expected!')
        else {
          const sections = template.templateSections.nodes.map((section) => {
            const { id, code, title, templateElementsBySectionId } = section as TemplateSection
            const elementsCount = templateElementsBySectionId.nodes.length
            const templateSection: TemplateSectionPayload = {
              id,
              code: code as string,
              title: title as string,
              elementsCount,
            }
            return templateSection
          })
          setSections(sections)
        }
      }
    }
  }, [data])

  return {
    loading,
    error,
    templateType,
    templateSections,
  }
}

export default useLoadTemplate
