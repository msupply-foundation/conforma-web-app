import React from 'react'

import { Route, Switch } from 'react-router-dom'
import { NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import OutcomeDetailsWrapper from './OutcomesDetailWrapper'
import OutcomeList from './OutcomesList'
import OutcomeTable from './OutcomesTable'
import { useOutcomeDisplayState } from './contexts/outcomesState'

// Wrapping outcomes so that outcomes display info is reloaded without full page reload
const Outcomes: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <Switch>
      {/* <Route exact path={`${path}/:tableName/:id`}> */}
      {/* <OutcomeDetailsWrapper displays={outcomeDisplaysStructure} /> */}
      {/* </Route> */}
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
