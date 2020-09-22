import React from 'react'
import { useQueryParameters } from '../containers/App'

const ApplicationNew: React.FC = () => {
  const applicationType = useQueryParameters().type
  return (
    <div>
      <h1>New Application screen here</h1>
      <p>
        Application type: <strong>{applicationType ? applicationType : 'Not specified'}</strong>
      </p>
    </div>
  )
}

export default ApplicationNew
