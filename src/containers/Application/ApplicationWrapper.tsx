import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useLoadApplication from '../../utils/hooks/useLoadApplicationNEW'
import { useRouter } from '../../utils/hooks/useRouter'
import { FullStructure, User } from '../../utils/types'
import { ApplicationHome } from './'

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
        <ApplicationHome structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/:sectionCode/Page:page">
        <ApplicationPageNew serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/summary">
        <ApplicationSummaryNew serialNumber={serialNumber} structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/submission">
        <ApplicationSubmissionNew serialNumber={serialNumber} structure={structure} />
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

const ApplicationStartNew: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>START PAGE</Header>
}

const ApplicationPageNew: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>IN PROGRESS PAGE</Header>
}

const ApplicationSummaryNew: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>SUMMARY PAGE</Header>
}

const ApplicationSubmissionNew: React.FC<ApplicationProps> = ({ serialNumber, structure }) => {
  return <Header>SUBMISSION PAGE</Header>
}

export default ApplicationWrapper
