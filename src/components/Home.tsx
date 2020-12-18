import React from 'react'
import { Label } from 'semantic-ui-react'
import { useUserState } from '../contexts/UserState'

const Home: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()
  return (
    <div>
      <Label>Hello, {currentUser?.firstName}. Welcome to the Dashboard!</Label>
    </div>
  )
}

export default Home
