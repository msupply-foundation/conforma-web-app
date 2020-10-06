import React from 'react'

interface IProps {
  type: string
}

const ApplicationStart: React.FC<IProps> = (props) => {
  const { type } = props
  return (
    <div>
      <h1>Start Application screen here</h1>
      <p>
        Application type: <strong>{type ? type : 'Not specified'}</strong>
      </p>
    </div>
  )
}

export default ApplicationStart
