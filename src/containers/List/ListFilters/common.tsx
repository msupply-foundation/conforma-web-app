import React, { useState } from 'react'
import useOnclickOutside from 'react-cool-onclickoutside'
import { startCase as lodashStartCase } from 'lodash'
import { Checkbox, Dropdown, Icon, Label } from 'semantic-ui-react'
import { FilterContainerProps, FilterOptionsProps } from './types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import {
  ApplicationOutcome,
  ApplicationStatus,
  AssignerAction,
  ReviewerAction,
} from '../../../utils/generated/graphql'
import useLocalisedEnums from '../../../utils/hooks/useLocalisedEnums'
import { FilterTitleProps } from './DateFilter/types'

export const startCase = (string: string) => lodashStartCase(string.toLowerCase())

const FilterContainer: React.FC<FilterContainerProps> = ({
  children,
  title = '',
  label,
  onRemove,
  trigger,
  setFocus = () => {},
}) => {
  const { t } = useLanguageProvider()
  const [isOpen, setIsOpen] = useState(false)

  const ref = useOnclickOutside(() => setIsOpen(false))

  return (
    <div className="active-filter">
      {label && (
        <Label color="grey" circular size="mini" floating>
          {label}
        </Label>
      )}
      <div ref={ref}>
        <Dropdown
          multiple
          text={!trigger ? title : undefined}
          trigger={trigger && <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>}
          icon={trigger ? null : undefined}
          open={isOpen}
          onOpen={() => {
            if (isOpen) return
            setIsOpen(true)
            setFocus()
          }}
        >
          <Dropdown.Menu>
            {children}
            <Dropdown.Divider />
            <Dropdown.Item className="remove-filter" key="removeFilter" onClick={() => onRemove()}>
              <Icon name="remove circle" />
              {t('FILTER_REMOVE')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

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
  const { AssignAction, ReviewAction, Outcome, Status } = useLocalisedEnums()

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
                Outcome?.[option as ApplicationOutcome] ??
                Status?.[option as ApplicationStatus] ??
                AssignAction?.[option as AssignerAction] ??
                ReviewAction?.[option as ReviewerAction] ??
                option
              }
              checked={isOptionActive}
            />
          </Dropdown.Item>
        )
      })}
    </>
  )
}
const FilterTitle: React.FC<FilterTitleProps> = ({ title, criteria = '', icon }) => {
  return (
    <div className="filter-title">
      {icon && <Icon name={icon} />}
      <div className={title && criteria ? 'title-and-criteria' : ''}>
        {criteria && <div className="filter-criteria">{criteria}</div>}
        {title && <div>{title}</div>}
      </div>
    </div>
  )
}

export { FilterOptions, FilterContainer, FilterTitle }
