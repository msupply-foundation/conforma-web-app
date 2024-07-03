import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Admin, Dashboard, NoMatch, Footer } from '../../components'
import { ApplicationCreate, ApplicationWrapper } from '../Application'
import UserArea from '../User/UserArea'
import Login from '../User/Login'
import ListWrapper from '../List/ListWrapper'
import { FormElementUpdateTrackerProvider } from '../../contexts/FormElementUpdateTrackerState'
import { Container, Label } from 'semantic-ui-react'
// import DevOptions from '../Dev/DevOptions'
import DevRoutes from '../Dev/DevRoutes'
import DataViews from '../DataDisplay/DataViews'
import config from '../../config'
const { isProductionBuild } = config
import { Tracker } from './Tracker'
import Manage from '../../components/Admin/Manage'
import { usePrefs } from '../../contexts/SystemPrefs'
import { useLanguageProvider } from '../../contexts/Localisation'

const SiteLayout: React.FC = () => {
  const { maintenanceMode } = usePrefs()
  const { t } = useLanguageProvider()
  return (
    <Router>
      {/* Google Analytics */}
      <Tracker />
      <Container id="main-container" fluid>
        <UserArea />
        {/* <DevOptions /> */}
        <Container id="content-area" fluid>
          {maintenanceMode.enabled && (
            <Label
              content={t('SERVER_MAINTENANCE_MODE_LABEL')}
              color="pink"
              style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 1000 }}
            />
          )}
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/applications">
              <ListWrapper />
            </Route>
            <Route path="/application/new">
              <ApplicationCreate />
            </Route>
            <Route path="/application/:serialNumber">
              <FormElementUpdateTrackerProvider>
                <ApplicationWrapper />
              </FormElementUpdateTrackerProvider>
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/manage">
              <Manage />
            </Route>
            <Route path="/data">
              <DataViews />
            </Route>
            {!isProductionBuild && (
              <Route path="/dev">
                <DevRoutes />
              </Route>
            )}
            <Route>
              <NoMatch />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </Container>
    </Router>
  )
}

export default SiteLayout
