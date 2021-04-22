import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { LookupTableListPage, LookupTablePage } from '.'
import { useRouter } from '../../utils/hooks/useRouter'
import { LookUpTableImportCsvProvider } from '../contexts'

const LookupTableWrapper: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
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
}

export default LookupTableWrapper
