import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { LookupTableListPage } from './'
import { useRouter } from '../../utils/hooks/useRouter'
import { LookUpTableListProvider } from '../contexts/context'
import LookupTablePage from './LookupTablePage'

const LookupTableListWrapper: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <LookUpTableListProvider>
      <Switch>
        <Route exact path={path}>
          <LookupTableListPage />
        </Route>
        <Route exact path={`${path}/:lookupTableID`}>
          <LookupTablePage />
        </Route>
      </Switch>
    </LookUpTableListProvider>
  )
}

export default LookupTableListWrapper
