import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Header, Message } from 'semantic-ui-react'

import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useLoadApplication from '../../utils/hooks/useLoadApplicationNEW'
import { useRouter } from '../../utils/hooks/useRouter'
import { FullStructure, User } from '../../utils/types'
import { ApplicationHome } from './'
import strings from '../../utils/constants'

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

  console.log('structure', structure)

  return error ? (
    <Message error header={strings.ERROR_APPLICATION_PAGE} />
  ) : isLoading ? (
    <Loading />
  ) : structure ? (
    <Switch>
      <Route exact path="/applicationNEW/:serialNumber">
        <ApplicationHome structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/:sectionCode/Page:page">
        <ApplicationPageNEW structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/summary">
        <ApplicationSummaryNEW structure={structure} />
      </Route>
      <Route exact path="/applicationNEW/:serialNumber/submission">
        <ApplicationSubmissionNEW structure={structure} />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  ) : (
    <NoMatch />
  )
}

interface ApplicationProps {
  structure: FullStructure
}

const ApplicationPageNEW: React.FC<ApplicationProps> = ({ structure }) => {
  return <Header>IN PROGRESS PAGE</Header>
}

const ApplicationSummaryNEW: React.FC<ApplicationProps> = ({ structure }) => {
  return <Header>SUMMARY PAGE</Header>
}

const ApplicationSubmissionNEW: React.FC<ApplicationProps> = ({ structure }) => {
  return <Header>SUBMISSION PAGE</Header>
}

export default ApplicationWrapper
