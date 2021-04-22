import React from 'react'
import { Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom'
import { LookupTableListPage, LookupTablePage } from '.'
import { LookUpTableImportCsvProvider } from '../contexts'

const LookupTableRoutes: React.FC<RouteComponentProps<{ path: string }>> = ({
  match: { path },
}) => (
  <LookUpTableImportCsvProvider>
    <Switch>
      <Route exact path={[path, `${path}/import`]}>
        <LookupTableListPage basePath={path} />
      </Route>
      <Route exact path={[`${path}/:lookupTableID`, `${path}/:lookupTableID/import`]}>
        <LookupTablePage basePath={path} />
      </Route>
    </Switch>
  </LookUpTableImportCsvProvider>
)

export default withRouter(LookupTableRoutes)
