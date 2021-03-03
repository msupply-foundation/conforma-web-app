import { useEffect, useState } from 'react'
import {
  GetTemplateQuery,
  Template,
  TemplateSection,
  useGetTemplateQuery,
} from '../generated/graphql'
import { getTemplateSections } from '../helpers/application/getSectionsDetails'
import { SectionDetails, TemplateDetails } from '../types'

interface useLoadTemplateProps {
  templateCode: string
}

const useLoadTemplate = (props: useLoadTemplateProps) => {
  const { templateCode } = props
  const [template, setTemplate] = useState<TemplateDetails>()
  const [sections, setSectionsDetails] = useState<SectionDetails[]>()
  const [elementsIds, setElementsIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { data, loading: apolloLoading, error: apolloError } = useGetTemplateQuery({
    variables: {
      code: templateCode,
    },
  })

  useEffect(() => {
    // Check that only one tempalte matched
    let error = checkForTemplateErrors(data)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    const template = data?.templates?.nodes[0] as Template

    error = checkForTemplatSectionErrors(template)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }

    const { id, code, name, startMessage } = template

    setTemplate({
      id,
      code,
      name: name as string,
      startMessage: startMessage ? startMessage : undefined,
    })

    const templateSections = template.templateSections.nodes as TemplateSection[]
    const sections = getTemplateSections(templateSections)
    setSectionsDetails(sections)

    const elements = [] as number[]

    templateSections.forEach((section) => {
      const { templateElementsBySectionId } = section as TemplateSection
      templateElementsBySectionId.nodes.forEach((element) => {
        if (element?.id && element.category === 'QUESTION') elements.push(element.id)
      })
    })
    setElementsIds(elements)

    setLoading(false)
  }, [data])

  return {
    loading: apolloLoading || loading,
    error: apolloError?.message || error,
    template,
    sections,
    elementsIds,
  }
}

function checkForTemplateErrors(data: GetTemplateQuery | undefined) {
  if (data?.templates?.nodes?.length === null) return 'Unexpected template result'
  const numberOfTemplates = data?.templates?.nodes.length as number
  if (numberOfTemplates === 0) return 'Template not found'
  if (numberOfTemplates > 1) return 'More then one template found'
  return null
}

function checkForTemplatSectionErrors(template: Template) {
  if (template?.templateSections?.nodes === null) return 'Unexpected template section result'
  const numberOfSections = template?.templateSections?.nodes.length as number
  if (numberOfSections === 0) return 'No template sections'
  return null
}

export default useLoadTemplate
