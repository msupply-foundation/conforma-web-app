import React from 'react'
import { Dropdown, Checkbox } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'

/**
 * When displayed on mobile devices, the table becomes "stacked", and the header
 * row ends up in a single cell at the top. It's mostly useless, except for the
 * ability to change the sort column, so this component provides an alternative
 * "sort" UI for mobile, and we hide the normal table header
 */

interface MobileHeaderProps {
  options: { key: string; text: string; value: string }[]
  sortColumn?: string
  sortDirection?: 'ascending' | 'descending'
  handleSort: Function
  defaultSort?: string
}

export const TableMobileHeader: React.FC<MobileHeaderProps> = ({
  options,
  sortColumn,
  sortDirection,
  handleSort,
  defaultSort,
}) => {
  const { t } = useLanguageProvider()

  return (
    <div
      className="flex-row-start-center slightly-smaller-text"
      style={{ gap: 10, flexWrap: 'wrap' }}
    >
      {t('FILTER_SORT_BY')}:
      <Dropdown
        selection
        options={options}
        value={sortColumn ?? defaultSort}
        onChange={(_, { value }) => handleSort(value)}
        style={{ maxHeight: 600 }}
      />
      {(sortColumn || defaultSort) && (
        <Checkbox
          style={{ fontSize: '95%' }}
          label={sortDirection === 'ascending' ? t('FILTER_ASCENDING') : t('FILTER_DESCENDING')}
          checked={sortDirection === 'ascending'}
          toggle
          onChange={() => handleSort(sortColumn ?? defaultSort)}
        />
      )}
    </div>
  )
}
