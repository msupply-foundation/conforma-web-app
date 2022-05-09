import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import DataDisplayDetail from './DataDisplayDetail'
import DataDisplayTable from './DataDisplayTable'

const DataDisplays: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <Switch>
      <Route exact path={`${path}/:tableName/:id`}>
        <DataDisplayDetail />
      </Route>
      <Route exact path={`${path}/:tableName`}>
        <DataDisplayTable />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default DataDisplays
