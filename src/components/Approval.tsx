import React from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

type TParams = { appId: string; sectionName?: string; page?: string }

const Approval: React.FC = () => {
  const { appId, sectionName, page }: TParams = useParams()
  return (
    <div>
      <h1>Application Approval page</h1>
      <p>Application ID: {appId}</p>
      <p>Only the Director can see this page.</p>
    </div>
  )
}

export default Approval
