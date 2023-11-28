import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Message } from 'semantic-ui-react'

import { ApplicationContainer, Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useLoadApplication from '../../utils/hooks/useLoadApplication'
import { useRouter } from '../../utils/hooks/useRouter'
import { User } from '../../utils/types'
import { ApplicationHome, ApplicationSubmission, ApplicationPageWrapper } from './'
import { useLanguageProvider } from '../../contexts/Localisation'
import { ReviewWrapper } from '../Review'

const ApplicationWrapper: React.FC = () => {
  const { t } = useLanguageProvider()
  const {
    match: { path },
    query: { serialNumber },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()

  const { error, isLoading, structure } = useLoadApplication({
    serialNumber,
    currentUser: currentUser as User,
    networkFetch: true,
  })

  return error ? (
    <Message error header={t('ERROR_APPLICATION_PAGE')} list={[error]} />
  ) : isLoading ? (
    <Loading />
  ) : structure ? (
    <Switch>
      <Route path={`${path}/review`}>
        <ReviewWrapper structure={structure} />
      </Route>
      <Route exact path={path}>
        <ApplicationContainer template={structure.info.template} applicationInfo={structure.info}>
          <ApplicationHome structure={structure} template={structure.info.template} />
        </ApplicationContainer>
      </Route>
      <Route exact path={`${path}/submission`}>
        <ApplicationContainer template={structure.info.template} applicationInfo={structure.info}>
          <ApplicationSubmission structure={structure} />
        </ApplicationContainer>
      </Route>
      <Route>
        <ApplicationContainer template={structure.info.template} applicationInfo={structure.info}>
          <ApplicationPageWrapper structure={structure} />
        </ApplicationContainer>
      </Route>
    </Switch>
  ) : (
    <NoMatch />
  )
}

export default ApplicationWrapper
