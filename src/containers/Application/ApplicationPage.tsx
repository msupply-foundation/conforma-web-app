import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useNavigationState } from '../Main/NavigationState'
import {
  ApplicationHeader,
  ApplicationSummary,
  ApplicationStep,
} from '../../components/Application'
import { Application, useGetApplicationQuery } from '../../generated/graphql'

type TParams = { appId: string; sectionName?: string; page?: string }

export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { summary } = props
  const { appId, sectionName, page }: TParams = useParams()
  const { navigationState, setNavigationState } = useNavigationState()
  const { mode } = navigationState.queryParameters

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: 885,
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      const applications = data.applications.nodes as Application[]
      console.log(`applications: ${applications.length}`)

      // setUserState({ type: 'updateUsersList', updatedUsers: userNames })
    }
  }, [data, error])

  console.log('ApplicationPage', navigationState, appId, sectionName, page)

  return summary ? (
    <ApplicationSummary />
  ) : (
    <div>
      <h1>TEST</h1>
      <ApplicationHeader mode={mode} serial={1} name="test" sectionName={sectionName} page={page} />
      {page && <ApplicationStep />}
    </div>
  )
}

export default ApplicationPage
