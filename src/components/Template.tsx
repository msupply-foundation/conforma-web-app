import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import { useRouter } from '../utils/hooks/useRouter'

type TParams = { templateId: string; step?: string }

const Template: React.FC = () => {
  const { query } = useRouter()
  const { templateId, step } = query

  return (
    <Container text>
      <Header as="h1" content="Template Builder" />
      <Header
        as="h2"
        content={`This is the ${step} step of creating/editing the template code: ${templateId}`}
      />
    </Container>
  )
}
export default Template
