import React from 'react'
import { hot } from 'react-hot-loader'
import Footer from './Main/Footer'
import SiteLayout from './Main/SiteLayout'
import UserArea from './User/UserArea'
import { UserProvider } from '../contexts/UserState'

const App: React.FC = () => {
  return (
    <div>
      <UserProvider>
        <UserArea />
      </UserProvider>
      <SiteLayout />
      <Footer />
    </div>
  )
}

declare const module: any
export default hot(module)(App)
