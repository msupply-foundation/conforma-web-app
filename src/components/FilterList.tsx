import React from 'react'
import { Button, List } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useRouter } from '../hooks/useRouter'

const FilterList: React.FC = () => {
  const { pathname } = useRouter()

  return (
    <List horizontal>
      <List.Item>
        <Button
          key={`app-list-button-draft-assessment`}
          content="Change query: Draft/Assessment"
          as={Link}
          to="?status=draft&stage=assessment"
        />
      </List.Item>
      <List.Item>
        <Button
          key={`app-list-button-submitted-screening`}
          content="Change query: Submitted/Screening"
          as={Link}
          to="?status=submitted&stage=screening"
        />
      </List.Item>
      <List.Item>
        <Button key={`app-list-button-reset`} content="Reset query" as={Link} to={pathname} />
      </List.Item>
    </List>
  )
}

export default FilterList
