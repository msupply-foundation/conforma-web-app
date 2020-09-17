import React from 'react'
import { useQueryParameters } from './App'

const ApplicationNew: React.FC = () => {
  const applicationType = useQueryParameters().type
  return (
    <div>
      <h1>New Application screen here</h1>
      <p>Application type: {applicationType ? applicationType : 'Not specified'}</p>
    </div>
  )
}

export default ApplicationNew
