import React from 'react'
import { useQueryParameters } from './App'
import { useHistory, useLocation, useParams } from 'react-router-dom'

type TParams = { appId: string; sectionName?: string; page?: string }

export interface AppProps {
  summary?: boolean
}

const Application: React.FC<AppProps> = (props) => {
  const { appId, sectionName, page }: TParams = useParams()

  console.log(useLocation().pathname)
  // const { section, page } = useQueryParameters()
  return (
    <div>
      <h1>Application</h1>
      <h3>ID: {appId}</h3>
      {props.summary ? (
        <p>
          This is the Application <strong>SUMMARY</strong> page of Application with ID: {appId}.
        </p>
      ) : !sectionName && !page ? (
        <p>
          This is the <strong>HOME</strong> page of Application with ID: {appId}
        </p>
      ) : (
        <p>
          We are on <strong>Page {page}</strong> of <strong>Section: {sectionName}</strong>.
        </p>
      )}
      <NextPageButton sectionName={sectionName} page={page} />
    </div>
  )
}

export default Application

type ButtonProps = { sectionName?: string; page?: string }

const NextPageButton: React.FC<ButtonProps> = (props) => {
  const history = useHistory()
  const handleClick = () => {
    history.push('p' + (Number(props.page) + 1))
  }
  console.log(props.sectionName)
  if (!props.sectionName) {
    return <div></div>
  }
  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}
