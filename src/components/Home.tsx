import React from 'react'
import { Link } from 'react-router-dom'
import { Label, Header, List } from 'semantic-ui-react'
import { useUserState } from '../contexts/UserState'

const Home: React.FC = () => {
  const {
    userState: { currentUser },
  } = useUserState()
  return (
    <div>
      <Label>Hello, {currentUser?.firstName}. Welcome to the Dashboard!</Label>
      <Header as="h2">Quick Links (for Dev)</Header>
      <List>
        <List.Item>
          <Link to="/applications">Applications list</Link>
        </List.Item>
        <List.Item>
          <Link to="/application/new?type=TestRego">Feature showcase application</Link>
        </List.Item>
        <List.Item>
          <Link to="/application/new?type=UserRegistration">User registration application</Link>
        </List.Item>
      </List>
    </div>
  )
}

export default Home
