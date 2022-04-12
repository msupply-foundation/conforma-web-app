import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { NoMatch } from '../../components'
import { ToastDemo } from '../../contexts/Toast/ToastDemo'
import { useRouter } from '../../utils/hooks/useRouter'

const DevRoutes: React.FC = () => {
  const {
    match: { path },
  } = useRouter()

  return (
    <Switch>
      <Route path={`${path}/toast-demo`}>
        <ToastDemo />
      </Route>
      <Route>
        <NoMatch />
      </Route>
    </Switch>
  )
}

export default DevRoutes
