import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button, Card, List, Label, Segment } from 'semantic-ui-react'
import { useNavigationState } from '../containers/Main/NavigationState'

export const NotificationsList: React.FC = () => {
  const { navigationState, setNavigationState } = useNavigationState()
  const { pathname, queryParameters } = navigationState

  return (
    <Segment.Group>
      <Card>
        <Card.Content header="Notification Center" />
        <Card.Content description="List of notifications for the current user. Can be filtered with query parameters, e.g:" />
      </Card>
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
      {Object.keys(queryParameters).length > 0 && <h4>Query parameters:</h4>}
      <List>
        {Object.entries(queryParameters).map(([key, value]) => (
          <List.Item>{key + ' : ' + value}</List.Item>
        ))}
      </List>
      <h4>Notifications:</h4>
      <Label>
        <Link to={'/notifications/567'}>Your message — click to view</Link>
      </Label>
    </Segment.Group>
  )
}

type TParams = { notificationId: string }

export const Notification: React.FC = () => {
  const { notificationId }: TParams = useParams()

  return (
    <div>
      <h1>Title of Message</h1>
      <p>Dear user, this message has the id: {notificationId}.</p>
      <p>
        <Link to="/notifications">Back to Notification Center</Link>
      </p>
    </div>
  )
}
