import React from 'react'
import { startCase as lodashStartCase } from 'lodash'
import { Checkbox, Dropdown, Icon, Label } from 'semantic-ui-react'
import { FilterContainerProps, FilterOptionsProps } from './types'
import strings from '../../../utils/constants'
import { ApplicationOutcome, ApplicationStatus } from '../../../utils/generated/graphql'
import enumsToLocalStrings from '../../../utils/data/enumsToLocalisedStrings'

export const startCase = (string: string) => lodashStartCase(string.toLowerCase())

const FilterContainer: React.FC<FilterContainerProps> = ({
  children,
  title = '',
  selectedCount = 0,
  onRemove,
  replacementTrigger,
}) => (
  <div className="active-filter">
    {selectedCount > 0 && (
      <Label color="grey" circular size="mini" floating>
        {selectedCount}
      </Label>
    )}
    <Dropdown
      multiple
      text={!replacementTrigger ? title : undefined}
      trigger={replacementTrigger}
      icon={replacementTrigger ? null : undefined}
    >
      <Dropdown.Menu>
        {children}
        <Dropdown.Divider />
        <Dropdown.Item className="remove-filter" key="removeFilter" onClick={() => onRemove()}>
          <Icon name="remove circle" />
          {strings.FILTER_REMOVE}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
)

const FilterOptions: React.FC<FilterOptionsProps> = ({
  setActiveOption,
  setInactiveOption,
  activeOptions,
  optionList,
}) => {
  const missingOptions = activeOptions.filter(
    (_option) => !optionList.find((option) => startCase(option) === startCase(_option))
  )
  const availableOptions = [...missingOptions, ...optionList]

  return (
    <>
      {availableOptions.map((option) => {
        const isOptionActive = !!activeOptions.find(
          (_option) => startCase(option) === startCase(_option)
        )
        return (
          <Dropdown.Item
            key={option}
            onClick={(e) => {
              e.stopPropagation()
              if (isOptionActive) setInactiveOption(option)
              else setActiveOption(option)
            }}
          >
            <Checkbox
              label={
                enumsToLocalStrings?.[option as ApplicationOutcome | ApplicationStatus] ||
                startCase(option)
              }
              checked={isOptionActive}
            />
          </Dropdown.Item>
        )
      })}
    </>
  )
}

export { FilterOptions, FilterContainer }
