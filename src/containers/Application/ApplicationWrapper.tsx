import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useLoadApplication from '../../utils/hooks/useLoadApplicationNEW'
import { useRouter } from '../../utils/hooks/useRouter'
import { FullStructure, User } from '../../utils/types'

const ApplicationWrapper: React.FC = () => {
  const { pathname, query } = useRouter()
  const { serialNumber } = query
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, isLoading, structure, template } = useLoadApplication({
    serialNumber,
    currentUser: currentUser as User,
    networkFetch: true,
  })

  return isLoading ? (
    <Loading />
  ) : structure ? (
    <Switch>
      <Route exact path="/applicationNEW/:serialNumber">
        <ApplicationStartNEW serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/:sectionCode/Page:page">
        <ApplicationPageNEW serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/summary">
        <ApplicationSummaryNEW serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/submission">
        <ApplicationSubmissionNEW serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  ) : null
}

interface ApplicationProps {
  serialNumber: string
  structure: FullStructure
}

const ApplicationStartNEW: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>START PAGE</Header>
}

const ApplicationPageNEW: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>IN PROGRESS PAGE</Header>
}

const ApplicationSummaryNEW: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>SUMMARY PAGE</Header>
}

const ApplicationSubmissionNEW: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>SUBMISSION PAGE</Header>
}

export default ApplicationWrapper
