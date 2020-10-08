import React from 'react'
import { Route } from 'react-router-dom'

interface ContextRouteProps {
  contextProvider: any
  component: React.FC
  [key: string]: any
}

const ContextRoute: React.FC<ContextRouteProps> = (props) => {
  const { contextProvider: Provider, component: Component, ...routeProps } = props
  return (
    <Route {...routeProps}>
      <Provider>
        <Component />
      </Provider>
    </Route>
  )
}

export default ContextRoute
