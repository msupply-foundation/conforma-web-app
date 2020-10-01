import React from 'react'
import { useNavigationState } from '../../containers/Main/QueryState'

const ApplicationNew: React.FC = () => {
  const { navigationState, setNavigationState } = useNavigationState()
  const { type } = navigationState.queryParameters

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
