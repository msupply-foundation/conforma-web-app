import React, { useState } from 'react'
import { Dropdown, Header, Icon, Label } from 'semantic-ui-react'
import { useTemplateState } from '../../TemplateWrapper'
import DropdownIO from '../../../shared/DropdownIO'
import { DataViewFilter, useDataViews } from './useDataViews'
import { useOperationState } from '../../../shared/OperationContext'

export const DataViewSelector: React.FC<{}> = () => {
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [menuSelection, setMenuSelection] = useState<number>()
  const [menuFilter, setMenuFilter] = useState<DataViewFilter>('SUGGESTED')
  const [selectedDataView, setSelectedDataView] = useState<string>()
  const { current, menuItems } = useDataViews(menuFilter)

  const menuOptions = menuItems.map(({ id, code, identifier, title }) => ({
    key: identifier,
    value: id,
    text:
      id === menuSelection ? (
        title
      ) : (
        <>
          {title}
          <br />
          <span className="smaller-text">Code: {code}</span>
          <br />
          <span className="smaller-text">ID: {identifier}</span>
        </>
      ),
  }))

  const addDataViewJoin = () => {
    if (menuSelection) {
      updateTemplate(template, {
        templateDataViewJoinsUsingId: { create: { dataViewId: menuSelection } },
      })
      setMenuSelection(undefined)
    }
  }

  const deleteDataViewJoin = () => {
    //
  }

  return (
    <>
      <Header as="h3">Connected Data Views</Header>
      <div className="flex-row-start-center" style={{ gap: 5, marginBottom: 10 }}>
        <Dropdown
          placeholder="Search Data Views"
          selection
          search={(data, searchText) => {
            const matching = menuItems
              .filter(({ code }) => code.includes(searchText))
              .map(({ id }) => id)
            console.log(matching)
            return data.filter((item) => matching.includes(item.value as number))
          }}
          value={menuSelection}
          onChange={(_, { value }) => setMenuSelection(value as number)}
          style={{ minWidth: 400 }}
          options={menuOptions}
        ></Dropdown>
        {
          <Icon
            className="clickable"
            name="add square"
            size="large"
            onClick={addDataViewJoin}
            style={{ visibility: menuSelection ? 'visible' : 'hidden' }}
          />
        }
        {
          <Icon
            className="clickable"
            size="large"
            name="minus square"
            onClick={deleteDataViewJoin}
            style={{ visibility: selectedDataView ? 'visible' : 'hidden' }}
          />
        }
        <DropdownIO
          value={menuFilter}
          title="Filter list"
          options={[
            { key: 'suggested', text: 'Suggested', value: 'SUGGESTED' },
            { key: 'all', text: 'All', value: 'ALL' },
            { key: 'applicant', text: 'Accessible to Applicant', value: 'APPLICANT_ACCESSIBLE' },
          ]}
          getKey={'key'}
          getValue={'value'}
          getText={'text'}
          setValue={(_, fullValue) => {
            setMenuFilter(fullValue.value)
          }}
          additionalStyles={{ marginBottom: 0 }}
        />
      </div>
      <div className="filter-joins">
        {current.map((dv) => (
          <>
            <Label
              key={dv.id}
              className={`${template.canEdit ? 'clickable' : ''}${
                dv.identifier === selectedDataView ? ' builder-selected' : ''
              }`}
              style={{ fontSize: '100%', position: 'relative' }}
              onClick={() => {
                if (dv.identifier === selectedDataView) setSelectedDataView(undefined)
                else setSelectedDataView(dv.identifier)
              }}
            >
              <div
                className="ext-icon clickable"
                onClick={() =>
                  window.open(
                    `/admin/data-views?selected-table=${dv.tableName}&data-view=${dv.identifier}`,
                    '_blank'
                  )
                }
              >
                <Icon name="external" size="small" className="floating-icon clickable" />
              </div>
              {dv.title}
              <br />
              <span className="slightly-smaller-text" style={{ fontWeight: 400 }}>
                <strong>Code:</strong> {dv.code}
                <br /> <strong>ID:</strong> {dv.identifier}
              </span>
            </Label>
          </>
        ))}
      </div>
    </>
  )
}
