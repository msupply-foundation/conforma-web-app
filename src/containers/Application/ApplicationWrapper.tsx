import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Message } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useLoadApplication from '../../utils/hooks/useLoadApplicationNEW'
import { useRouter } from '../../utils/hooks/useRouter'
import { User } from '../../utils/types'
import { ApplicationHome, ApplicationPage, ApplicationSubmission, ApplicationSummary } from './'
import strings from '../../utils/constants'
import { ReviewWrapper } from '../Review'

const ApplicationWrapper: React.FC = () => {
  const {
    match: { path },
    query: { serialNumber },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const {
    error,
    isLoading,
    isMessageEvaluated,
    submissionMessage,
    structure,
    template,
  } = useLoadApplication({
    serialNumber,
    currentUser: currentUser as User,
    networkFetch: true,
  })

  return error ? (
    <Message error header={strings.ERROR_APPLICATION_PAGE} list={[error]} />
  ) : isLoading || !isMessageEvaluated ? (
    <Loading />
  ) : structure && template ? (
    <Switch>
      <Route exact path={path}>
        <ApplicationHome structure={structure} template={template} />
      </Route>
      <Route exact path={`${path}/:sectionCode/Page:page`}>
        <ApplicationPage structure={structure} />
      </Route>
      <Route exact path={`${path}/summary`}>
        <ApplicationSummary structure={structure} />
      </Route>
      <Route exact path={`${path}/submission`}>
        <ApplicationSubmission structure={structure} submissionMessage={submissionMessage} />
      </Route>
      <Route path={`${path}/review`}>
        <ReviewWrapper structure={structure} />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  ) : (
    <NoMatch />
  )
}

export default ApplicationWrapper
