import React, { useEffect, useState } from 'react'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  ApplicationHeader,
  ApplicationSummary,
  ApplicationStep,
} from '../../components/Application'
import {
  Application,
  useGetApplicationQuery,
} from '../../utils/generated/graphql'
import { Container } from 'semantic-ui-react'
import Loading from '../../components/Loading'

export interface AppPageProps {
  summary?: boolean
}

const ApplicationPage: React.FC<AppPageProps> = (props) => {
  const { summary } = props
  const [ applicationName, setName ] = useState('')
  const { query } = useRouter()
  const { mode, serialNumber, sectionCode, page } = query

  const { data, loading, error } = useGetApplicationQuery({
    variables: {
      serial: Number(serialNumber),
    },
  })

  useEffect(() => {
    if (data && data.applications && data.applications.nodes) {
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')

      const application = data.applications.nodes[0] as Application
      if (application.template) {
        setName(application.name as string)
      }
    }
  }, [data, error])

  return loading ? (
    <Loading />
  ) : summary ? (
    <ApplicationSummary />
  ) : (
    <Container>
      <ApplicationHeader mode={mode} serialNumber={serialNumber} name={applicationName} />
      {sectionCode && page && <ApplicationStep />}
    </Container>
  )
}

export default ApplicationPage
