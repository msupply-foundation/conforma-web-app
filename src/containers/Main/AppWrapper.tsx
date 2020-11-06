import React from 'react'
import { hot } from 'react-hot-loader'
import { Footer } from '../../components'
import SiteLayout from './SiteLayout'
import UserArea from '../User/UserArea'
import { UserProvider } from '../../contexts/UserState'

const AppWrapper: React.FC = () => {
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
export default hot(module)(AppWrapper)
