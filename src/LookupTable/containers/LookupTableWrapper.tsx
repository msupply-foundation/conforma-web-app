import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { LookupTableListPage } from '.'
import { useRouter } from '../../utils/hooks/useRouter'
import LookupTablePage from './LookupTablePage'
import { LookUpTableImportCsvProvider } from '../contexts'

const LookupTableWrapper: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <LookUpTableImportCsvProvider>
      <Switch>
        <Route exact path={path}>
          <LookupTableListPage />
        </Route>
        <Route exact path={`${path}/:lookupTableID`}>
          <LookupTablePage />
        </Route>
      </Switch>
    </LookUpTableImportCsvProvider>
  )
}

export default LookupTableWrapper
