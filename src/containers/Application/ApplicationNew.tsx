import React, { useEffect } from 'react'
import { Button, Container, Header, Label, List, Segment } from 'semantic-ui-react'
import { useNavigationState } from '../Main/NavigationState'
import { useTemplateState } from './TemplateState'
import {
  Template,
  TemplateElementsConnection,
  TemplateSection,
  useGetTemplateQuery,
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
      const { id, code, name } = data.templates.nodes[0] as Template
      const templateName = name ? name : 'Undefined name'
      const nextType = {
        id,
        code,
        name: templateName,
        description: 'TODO, Some description about this template',
        documents: Array<string>(),
      }
      if (
        data.templates.nodes[0]?.templateSections &&
        data.templates.nodes[0]?.templateSections.nodes
      ) {
        if (data.templates.nodes[0]?.templateSections.nodes.length === 0)
          console.log('No Section on the template returned. At least one expected!')
        else {
          const nextSections = data.templates.nodes[0]?.templateSections.nodes.map((section) => {
            const { id, code, title } = section as TemplateSection
            const sectionCode = code ? code : 'Undefined code'
            const sectionTitle = title ? title : 'Undefined title'
            const {
              totalCount,
            } = section?.templateElementsBySectionId as TemplateElementsConnection
            return { id, code: sectionCode, title: sectionTitle, elementsCount: totalCount }
          })
          setTemplateState({ type: 'setCurrentTemplate', nextType, nextSections })
        }
      }
    }
  }, [data, error])

  return <ApplicationCreate type={templateType} sections={sections} route="/application/1" />
}

export default ApplicationNew
