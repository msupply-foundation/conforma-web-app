import React from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'

type TParams = { orgName: string }

export const Organisation: React.FC = () => {
  const { orgName }: TParams = useParams()

  return (
    <div>
      <h1>Organisation Home page</h1>
      <p>
        Home page for organisation: <strong>{orgName}</strong>.
      </p>
      <p>List of Members, summaries of applications (past and present), etc.</p>
      <p>
        <Link to={'/organisations/' + orgName + '/members'}>Edit this org's members</Link>
      </p>
    </div>
  )
}

export const OrgMemberEdit: React.FC = () => {
  const { orgName }: TParams = useParams()

  return (
    <div>
      <h1>Organisation — Edit members</h1>
      <p>
        A page to edit members of organisation: <strong>{orgName}</strong>.
      </p>
      <p>
        <Link to="./">Back to Organisation page</Link>
      </p>
    </div>
  )
}
