import { useEffect, useState } from 'react'
import {
  GetTemplateQuery,
  Template,
  TemplateSection,
  useGetTemplateQuery,
} from '../generated/graphql'
import { getTemplateSections } from '../helpers/application/getSectionsDetails'
import { TemplateDetails, User } from '../types'
import useEvaluateMessage from './useEvaluateMessage'

interface useLoadTemplateProps {
  currentUser: User
  templateCode?: string
}

const useLoadTemplate = ({ currentUser, templateCode }: useLoadTemplateProps) => {
  const [template, setTemplate] = useState<TemplateDetails>()
  const [message, setMessage] = useState<string>()
  const [shouldEvaluate, setShouldEvaluate] = useState(true)
  const [error, setError] = useState('')

  const { data, loading: apolloLoading, error: apolloError } = useGetTemplateQuery({
    variables: {
      code: templateCode || '',
    },
    skip: !templateCode,
  })

  const { evaluatedMessage, isMessageEvaluated } = useEvaluateMessage({
    currentUser,
    message,
    shouldEvaluate,
  })

  useEffect(() => {
    if (!data) return

    // Check that only one template matched
    let error = checkForTemplateErrors(data)
    if (error) {
      setError(error)
      return
    }

    const template = data?.templates?.nodes[0] as Template

    error = checkForTemplateSectionErrors(template)
    if (error) {
      setError(error)
      return
    }

    const { id, code, name, startMessage } = template

    if (startMessage === null) setShouldEvaluate(false)
    else setMessage(startMessage)

    const templateSections = template.templateSections.nodes as TemplateSection[]
    const sections = getTemplateSections(templateSections)
    const elementsIds: number[] = []

    templateSections.forEach((section) => {
      const { templateElementsBySectionId } = section as TemplateSection
      templateElementsBySectionId.nodes.forEach((element) => {
        if (element?.id && element.category === 'QUESTION') elementsIds.push(element.id)
      })
    })

    setTemplate({
      id,
      code,
      name: name as string,
      elementsIds,
      sections,
    })
  }, [data])

  return {
    loading: apolloLoading,
    error: apolloError?.message || error,
    isMessageEvaluated,
    startMessage: evaluatedMessage,
    template,
  }
}

function checkForTemplateErrors(data: GetTemplateQuery | undefined) {
  const numberOfTemplates = data?.templates?.nodes.length as number
  if (!numberOfTemplates || numberOfTemplates === 0) return 'Template not found'
  if (numberOfTemplates > 1) return 'More then one template found'
  return null
}

function checkForTemplateSectionErrors(template: Template) {
  const numberOfSections = template?.templateSections?.nodes.length as number
  if (!numberOfSections || numberOfSections === 0) return 'No template sections'
  return null
}

export default useLoadTemplate
