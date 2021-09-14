import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import OutcomeDetails from './OutcomesDetail'
import OutcomeTable from './OutcomesTable'

const Outcomes: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <Switch>
      <Route exact path={`${path}/:tableName/:id`}>
        <OutcomeDetails />
      </Route>
      <Route exact path={`${path}/:tableName`}>
        <OutcomeTable />
      </Route>
      <Route exact path={`${path}`}>
        // Redirect back to Dashboard?
        {/* <OutcomeList displays={outcomeDisplaysStructure} /> */}
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default Outcomes
