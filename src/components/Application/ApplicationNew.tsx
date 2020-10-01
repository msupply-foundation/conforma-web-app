import React from 'react'
import { useQueryState } from '../../containers/Main/QueryState'

const ApplicationNew: React.FC = () => {
  const { queryState, setQueryState } = useQueryState()
  const { type } = queryState.queryParameters

  return (
    <div>
      <h1>New Application screen here</h1>
      <p>
        Application type: <strong>{type ? type : 'Not specified'}</strong>
      </p>
    </div>
  )
}

export default ApplicationNew
