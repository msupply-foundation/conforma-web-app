import React from 'react'
import { useParams, Link, useLocation } from 'react-router-dom'
import { useQueryParameters } from './App'
import { List, Label } from 'semantic-ui-react'

export const NotificationsList: React.FC = () => {
  const queryParameters = useQueryParameters()

  return (
    <div>
      <h1>Notification Center</h1>
      <p>List of notifications for the current user.</p>
      <p>Can be filtered with query parameters, e.g:</p>

      <List>
        <List.Item>
          <Link to="?status=unread">Unread Notifications</Link>
        </List.Item>
        <List.Item>
          <Link to="?days=30&appid=1234">
            Notifications in the last 30 days associated with Application ID: 1234
          </Link>
        </List.Item>
        <List.Item>
          <Link to={useLocation().pathname}>Reset query</Link>
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
    </div>
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
