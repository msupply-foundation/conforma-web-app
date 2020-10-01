import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useQueryState } from '../Main/QueryState'
import { ApplicationHeader } from '../../components/Application'

type TParams = { appId: string; sectionName?: string; page?: string }

export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { appId, sectionName, page }: TParams = useParams()
  const { queryState, setQueryState } = useQueryState()
  const { mode } = queryState.queryParameters

  return (
    <div>
      <ApplicationHeader
        appId={appId}
        mode={mode}
        sectionName={sectionName}
        page={page}
        {...props}
      />
      <NextPageButton sectionName={sectionName} page={page} />
    </div>
  )
}

export default ApplicationPage

type ButtonProps = { sectionName?: string; page?: string }

const NextPageButton: React.FC<ButtonProps> = (props) => {
  const history = useHistory()
  const handleClick = () => {
    history.push('page' + (Number(props.page) + 1))
  }
  if (!props.sectionName) {
    return <div></div>
  }
  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}
