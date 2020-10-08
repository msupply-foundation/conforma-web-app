import React, { useEffect } from 'react'
import { useRouter } from '../../hooks/useRouter'
import {
  ApplicationHeader,
  ApplicationSummary,
  ApplicationStep,
} from '../../components/Application'
import { Application, useGetApplicationQuery } from '../../generated/graphql'

type TParams = { serialNumber: string; sectionName: string; page: string }
export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { summary } = props
  const { query } = useRouter()
  const { mode, serialNumber, sectionName, page } = query

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: Number(serialNumber),
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      const applications = data.applications.nodes as Application[]
      console.log(`applications: ${applications.length}`)

      // setUserState({ type: 'updateUsersList', updatedUsers: userNames })
    }
  }, [data, error])

  console.log('ApplicationPage', serialNumber, sectionName, page)

  return summary ? (
    <ApplicationSummary />
  ) : (
    <div>
      {data &&
        data.applications &&
        data.applications.nodes &&
        data.applications.nodes[0] &&
        serialNumber && (
          <ApplicationHeader
            mode={mode}
            serialNumber={serialNumber}
            name={data.applications.nodes[0].name ? data.applications.nodes[0].name : 'No name'}
          />
        )}
      {sectionName && page && <ApplicationStep />}
    </div>
  )
}

export default ApplicationPage
