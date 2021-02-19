import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Header } from 'semantic-ui-react'

import { NoMatch } from '../../components'

const ApplicationWrapper: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/application_new/new">
        <ApplicationCreateNew />
      </Route>
      <Route exact path="/application_new/:serialNumber">
        <ApplicationStartNew />
      </Route>
      <Route exact path="/application_new/:serialNumber/:sectionCode/Page:page">
        <ApplicationPageNew />
      </Route>
      <Route exact path="/application_new/:serialNumber/summary">
        <ApplicationSummaryNew />
      </Route>
      <Route exact path="/application_new/:serialNumber/submission">
        <ApplicationSubmissionNew />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

const ApplicationCreateNew: React.FC = () => {
  return <Header>CREATE PAGE</Header>
}

const ApplicationStartNew: React.FC = () => {
  return <Header>START PAGE</Header>
}

const ApplicationPageNew: React.FC = () => {
  return <Header>IN PROGRESS PAGE</Header>
}

const ApplicationSummaryNew: React.FC = () => {
  return <Header>SUMMARY PAGE</Header>
}

const ApplicationSubmissionNew: React.FC = () => {
  return <Header>SUBMISSION PAGE</Header>
}

export default ApplicationWrapper
