/*
This is just for *displaying* the column sorting state and providing a mechanism
to reset all sorting. You can't actually change the sort column from here.
*/

import React from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { Dropdown, Icon } from 'semantic-ui-react'
import { FilterTitle } from '../../List/ListFilters/common'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { SortColumn } from '../DataViewTable'

export const SortReset: React.FC<SortColumn> = ({ title, ascending }) => {
  const { strings } = useLanguageProvider()
  const { updateQuery } = useRouter()

  return (
    <div className="list-filter-container" style={{ minWidth: 120, justifyContent: 'flex-end' }}>
      <div className="active-filter">
        <Dropdown
          multiple
          icon={null}
          trigger={
            <FilterTitle
              title={title}
              criteria={strings.FILTER_SORT_BY}
              icon={ascending ? 'sort alphabet down' : 'sort alphabet up'}
            />
          }
        >
          <Dropdown.Menu>
            <Dropdown.Item
              className="remove-filter"
              key="removeFilter"
              onClick={() => updateQuery({ sortBy: null })}
            >
              <Icon name="remove circle" />
              {strings.FILTER_RESET_SORT}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}
