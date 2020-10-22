import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header } from 'semantic-ui-react'
import { useRouter } from '../utils/hooks/useRouter'

type TParams = { orgName: string }

export const Organisation: React.FC = () => {
  const { query } = useRouter()
  const { orgName } = query

  return (
    <Container text>
      <Header as="h1" content="Organisation Home page" />
      <Header as="h2" content={`Home page for organisation: ${orgName}`} />
      <Header
        as="h3"
        content="List of Members, summaries of applications (past and present), etc."
      />
      <Button
        content="Edit this org's members"
        as={Link}
        to={`/organisations/${orgName}/members`}
      />
    </Container>
  )
}

export const OrgMemberEdit: React.FC = () => {
  const { pathname, query } = useRouter()
  const { orgName } = query

  return (
    <Container text>
      <Header as="h1" content="Organisation — Edit members" />
      <Header as="h2" content={`A page to edit members of organisation: ${orgName}`} />
      <Button content="Back to Organisation page" as={Link} to={pathname} />
    </Container>
  )
}
