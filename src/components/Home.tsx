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
      <Header as="h1">For style reference:</Header>
      <p>Text is for Desktop sizes</p>
      <Header as="h1">H1 Open Sans 36px, Regular, #00000</Header>
      <h1>H1 Open Sans 36px, Regular, #00000</h1>
      <Header as="h2">H2 Open Sans 26px, Regular, #00000</Header>
      <Header as="h3">H3 Open Sans 20px, Regular, #4A4A4A</Header>
      <Header as="h4">H4 Open Sans 14px, Semibold, #4A4A4A, UPPERCASE</Header>
      <Header as="h5">H5 Open Sans 15px, Semibold, #4A4A4A</Header>
      <Header as="h6">H6 Open Sans 13px, Semibold, #4A4A4A</Header>
      <p>Paragraph Open Sans, 15px, Regular, #000000</p>
      <p>
        <strong>Paragraph-strong Open Sans, 15px, Semi-bold, #000000</strong>
      </p>
      <p>Secondary Open Sans, 13px, Regular, #000000</p>
      <p>Small Open Sans 12px, Regular, #000000</p>
      <p>Small Blue Open Sans, 12px, Regular, #003BFE</p>
      <p>Error Open Sans, 12px, Regular, #FF0082</p>
      <p>Label Open Sans, 15px, Semi-bold, #000000</p>
      <p>Input Open Sans, 15px, #4A4A4A</p>
    </div>
  )
}

export default Home
