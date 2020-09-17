import React from 'react'
import { useQueryParameters } from './App'
import { useParams } from 'react-router-dom'

type TParams = { appId: string }

const Application = () => {
  const params: TParams = useParams()
  const { section, page } = useQueryParameters()
  return (
    <div>
      <h1>Application</h1>
      {!section && !page ? (
        <p>
          This is the <strong>HOME</strong> page of Application with ID: {params.appId}
        </p>
      ) : (
        <p>
          We are on <strong>Page {page}</strong> of <strong>Section: {section}</strong>.
        </p>
      )}
    </div>
  )
}

export default Application
