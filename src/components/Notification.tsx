import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, List, Label, Segment, Container, Header } from 'semantic-ui-react'
import { useRouter } from '../hooks/useRouter'

export const NotificationsList: React.FC = () => {
  const { pathname, query } = useRouter()
  const { notificationId } = query

  return (
    <Segment.Group>
      <Header as="h1" content="Notification Center" />
      <Header
        as="h2"
        content="List of notifications for the current user. Can be filtered with query parameters, e.g:"
      />
      <List horizontal>
        <List.Item>
          <Button
            key="notifications-filter-unread"
            content="Unread Notifications"
            as={Link}
            to="?status=unread"
          />
        </List.Item>
        <List.Item>
          <Button
            key="notifications-filter-days30"
            content="Last 30 days (App. ID: 1234)"
            as={Link}
            to="?days=30&appid=1234"
          />
        </List.Item>
        <List.Item>
          <Button key="notifications-filter-reset" content="Reset query" as={Link} to={pathname} />
        </List.Item>
      </List>
      {Object.keys(query).length > 0 && <h4>Query parameters:</h4>}
      <List>
        {Object.entries(query).map(([key, value]) => (
          <List.Item>{key + ' : ' + value}</List.Item>
        ))}
      </List>
      <Header as="h4" content="Notifications" />
      <Label>
        <Button content="Your message — click to view" as={Link} to={'/notifications/567'} />
      </Label>
    </Segment.Group>
  )
}

export const Notification: React.FC = () => {
  const { query } = useRouter()
  const { notificationId } = query
  return (
    <Container text>
      <Header as="h1" content="Title of Message" />
      <Header as="h2" content={`Dear user, this message has the id: ${notificationId}`}>
        <Button content="Back to Notification Center" as={Link} to="/notifications" />
      </Header>
    </Container>
  )
}
