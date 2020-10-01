import React from 'react'
import { Button, List } from 'semantic-ui-react'
import { useNavigationState } from '../containers/Main/QueryState'

const FilterList: React.FC = () => {
  const { navigationState, setNavigationState } = useNavigationState()

  return (
    <List horizontal>
      <List.Item>
        <Button
          key={`app-list-button-draft-assessment`}
          content="Change query: Draft/Assessment"
          onClick={() =>
            setNavigationState({
              type: 'updateParameters',
              search: '?status=draft&stage=assessment',
            })
          }
        />
      </List.Item>
      <List.Item>
        <Button
          key={`app-list-button-submitted-screening`}
          content="Change query: Submitted/Screening"
          onClick={() =>
            setNavigationState({
              type: 'updateParameters',
              search: '?status=submitted&stage=screening',
            })
          }
        />
      </List.Item>
      <List.Item>
        <Button
          key={`app-list-button-reset`}
          content="Reset query"
          onClick={() => setNavigationState({ type: 'clearParameters' })}
        />
      </List.Item>
    </List>
  )
}

export default FilterList
