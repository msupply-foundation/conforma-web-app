import React from 'react'
import { useParams } from 'react-router-dom'

type TParams = { templateId: string; step?: string }

const Template: React.FC = () => {
  const { templateId, step }: TParams = useParams()

  return (
    <div>
      <h1>Template Builder</h1>
      <p>
        This is the <strong>{step}</strong> step of creating/editing the template with ID:{' '}
        <strong>{templateId}</strong>.
      </p>
    </div>
  )
}
export default Template
