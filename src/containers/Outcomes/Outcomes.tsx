import React from 'react'

import { Route, Switch } from 'react-router-dom'
import { Loading, NoMatch } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import OutcomeDetailsWrapper from './OutcomesDetailWrapper'
import OutcomeList from './OutcomesList'
import OutcomeTableWrapper from './OutcomesTableWrapper'
import OutcomeDisplaysContext, { useOutcomeDisplayState } from './contexts/outcomesState'

// Wrapping outcomes so that outcomes display info is reloaded without full page reload
const Outcomes: React.FC = () => (
  <OutcomeDisplaysContext>
    <OutcomesInner />
  </OutcomeDisplaysContext>
)

const OutcomesInner: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  const outcomeDisplayState = useOutcomeDisplayState()

  if (!outcomeDisplayState) return <Loading />

  const { error, outcomeDisplaysStructure } = outcomeDisplayState

  // if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  // Silently ignore errors for demo
  if (error) return null
  if (!outcomeDisplaysStructure) return <Loading />

  return (
    <Switch>
      <Route exact path={`${path}/:code/:id`}>
        <OutcomeDetailsWrapper displays={outcomeDisplaysStructure} />
      </Route>
      <Route exact path={`${path}/:code`}>
        <OutcomeTableWrapper displays={outcomeDisplaysStructure} />
      </Route>
      <Route exact path={`${path}`}>
        <OutcomeList displays={outcomeDisplaysStructure} />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default Outcomes
