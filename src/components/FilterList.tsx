import React from 'react'
import { Button, List } from 'semantic-ui-react'
import { useQueryState } from '../containers/Main/QueryState'

const FilterList: React.FC = () => {
  const { queryState, setQueryState } = useQueryState()
  const { pathname } = queryState

  return (
    <List horizontal>
      <List.Item>
        <Button
          key={`app-list-button-draft-assessment`}
          content="Change query: Draft/Assessment"
          onClick={() =>
            setQueryState({ type: 'updateParameters', search: '?status=draft&stage=assessment' })
          }
        />
      </List.Item>
      <List.Item>
        <Button
          key={`app-list-button-submitted-screening`}
          content="Change query: Submitted/Screening"
          onClick={() =>
            setQueryState({ type: 'updateParameters', search: '?status=submitted&stage=screening' })
          }
        />
      </List.Item>
      <List.Item>
        <Button
          key={`app-list-button-reset`}
          content="Reset query"
          onClick={() => setQueryState({ type: 'clearParameters' })}
        />
      </List.Item>
    </List>
  )
}

export default FilterList
