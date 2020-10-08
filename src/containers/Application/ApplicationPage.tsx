import React, { useEffect } from 'react'
import { useRouter } from '../../hooks/useRouter'
import {
  ApplicationHeader,
  ApplicationSummary,
  ApplicationStep,
} from '../../components/Application'
import { Application, useGetApplicationQuery } from '../../generated/graphql'
import { useApplicationState } from '../../contexts/ApplicationState'
import { Container } from 'semantic-ui-react'
import Loading from '../../components/Loading'

type TParams = { serialNumber: string; sectionName: string; page: string }
export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { isLoading, name, serial } = applicationState
  const { summary } = props
  const { query } = useRouter()
  const { mode, serialNumber, sectionName, page } = query

  console.log('ApplicationPage', isLoading, name, serial)

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: Number(serialNumber),
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      const applications = data.applications.nodes as Application[]
      console.log(`loaded applications: ${applications.length}`)
    }
  }, [data, error])

  return isLoading ? (
    <Loading />
  ) : summary ? (
    <ApplicationSummary />
  ) : (
    <Container>
      {serial && name && (
        <ApplicationHeader mode={mode} serialNumber={serial.toString()} name={name} />
      )}
      {sectionName && page && <ApplicationStep />}
    </Container>
  )
}

export default ApplicationPage
