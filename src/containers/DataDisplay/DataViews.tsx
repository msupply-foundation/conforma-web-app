import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import DataViewDetail from './DataViewDetail'
import DataViewTable from './DataViewTable'

const DataViews: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <Switch>
      <Route exact path={`${path}/:dataViewCode/:id`}>
        <DataViewDetail />
      </Route>
      <Route exact path={`${path}/:dataViewCode`}>
        <DataViewTable />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default DataViews
