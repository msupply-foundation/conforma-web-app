import React, { useState } from 'react'
import { Button, Dropdown, Header, Icon, Label } from 'semantic-ui-react'
import { useTemplateState } from '../../TemplateWrapper'
import DropdownIO from '../../../shared/DropdownIO'
import { FragmentFilter, useFragments } from './useManageFragments'
import { useOperationState } from '../../../shared/OperationContext'
import { Legend } from '../shared/Legend'

export const FragmentSelector: React.FC<{}> = () => {
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [menuSelection, setMenuSelection] = useState<number>()
  const [menuFilter, setMenuFilter] = useState<FragmentFilter>('SUGGESTED')
  const [selectedFragmentJoinId, setSelectedFragmentJoinId] = useState<number>()
  const { current, menuItems } = useFragments(menuFilter)

  const menuOptions = menuItems.map(({ id, name, metadata }) => ({
    key: name,
    value: id,
    text:
      id === menuSelection ? (
        name
      ) : (
        <>
          {name}
          <br />
          <span className="smaller-text">{metadata?.description ?? ''}</span>
        </>
      ),
  }))

  const addFragmentJoin = async () => {
    if (menuSelection) {
      setMenuSelection(undefined)
      await updateTemplate(template, {
        templateEvaluatorFragmentJoinsUsingId: { create: [{ evaluatorFragmentId: menuSelection }] },
      })
    }
  }

  const addAllInMenu = () => {
    updateTemplate(template, {
      templateEvaluatorFragmentJoinsUsingId: {
        create: menuItems.map(({ id }) => ({ evaluatorFragmentId: id })),
      },
    })
  }

  const deleteFragmentJoin = async () => {
    if (selectedFragmentJoinId) {
      await updateTemplate(template, {
        templateEvaluatorFragmentJoinsUsingId: { deleteById: [{ id: selectedFragmentJoinId }] },
      })
      setSelectedFragmentJoinId(undefined)
    }
  }

  const hasInaccessible = current.some((dv) => !dv.applicantAccessible && !dv.inActions)
  const hasTemplateElements = current.some((dv) => dv.inTemplateElements)
  const hasActions = current.some((dv) => dv.inActions)

  return (
    <div className="template-builder-section">
      <div className="flex-row-space-between-center" style={{ width: '100%', maxWidth: 500 }}>
        <Header as="h3">Connected Evaluator Fragments</Header>
        <p className="slightly-smaller-text" style={{ marginBottom: 10 }}>
          <a href="https://github.com/CarlosNZ/fig-tree-evaluator#fragments" target="_blank">
            Docs <Icon name="external" />
          </a>
        </p>
      </div>
      {template.canEdit && (
        <div className="flex-row-start-center" style={{ gap: 5, marginBottom: 10 }}>
          <Dropdown
            placeholder="Search Fragments"
            selection
            options={menuOptions}
            search={(data, searchText) => {
              const matching = menuItems
                .filter(({ name }) => name.includes(searchText))
                .map(({ id }) => id)
              return data.filter((item) => matching.includes(item.value as number))
            }}
            value={menuSelection ?? ''}
            onChange={(_, { value }) => {
              setMenuSelection(value as number)
              setSelectedFragmentJoinId(undefined)
            }}
            style={{ minWidth: 300 }}
          ></Dropdown>
          {menuSelection ? (
            <Icon className="clickable" name="add square" size="large" onClick={addFragmentJoin} />
          ) : (
            <Icon
              className="clickable"
              size="large"
              name="minus square"
              onClick={deleteFragmentJoin}
              style={{ visibility: selectedFragmentJoinId ? 'visible' : 'hidden' }}
            />
          )}
          <DropdownIO
            value={menuFilter}
            title="Filter menu"
            options={[
              { key: 'elements', text: 'In Form Elements', value: 'IN_ELEMENTS' },
              { key: 'actions', text: 'In Actions', value: 'IN_ACTIONS' },
              { key: 'suggested', text: 'All in use', value: 'SUGGESTED' },
              { key: 'all', text: 'All', value: 'ALL' },
              { key: 'applicant', text: 'Accessible to Applicant', value: 'APPLICANT_ACCESSIBLE' },
            ]}
            getKey={'key'}
            getValue={'value'}
            getText={'text'}
            setValue={(_, { value }) => setMenuFilter(value)}
            minLabelWidth={0}
            additionalStyles={{ marginBottom: 0 }}
          />
          {menuItems.length > 0 &&
            ['SUGGESTED', 'IN_ELEMENTS', 'IN_ACTIONS'].includes(menuFilter) && (
              <Button primary size="mini" content="Add all in menu" onClick={addAllInMenu} />
            )}
        </div>
      )}
      <div className="filter-joins">
        {current.map((frag) => (
          <>
            <Label
              key={frag.name}
              className={`${template.canEdit ? 'clickable' : ''}${
                frag.dataViewJoinId === selectedFragmentJoinId ? ' builder-selected' : ''
              }${
                !frag.applicantAccessible && !frag.inActions
                  ? ' entity-trim-inaccessible'
                  : frag.inTemplateElements
                  ? ' entity-trim-elements'
                  : frag.inActions
                  ? ' entity-trim-output'
                  : ''
              }`}
              style={{ fontSize: '100%', position: 'relative' }}
              onClick={() => {
                if (!template.canEdit) return
                if (frag.dataViewJoinId === selectedFragmentJoinId)
                  setSelectedFragmentJoinId(undefined)
                else {
                  setSelectedFragmentJoinId(frag.dataViewJoinId)
                  setMenuSelection(undefined)
                }
              }}
            >
              {/* TO-DO: Link to Fragment Editor */}
              {/* <div
                className="ext-icon clickable"
                onClick={() =>
                  window.open(
                    `/admin/data-views?selected-table=${frag.tableName}&data-view=${frag.identifier}`,
                    '_blank'
                  )
                }
              > 
                <Icon name="external" size="small" className="floating-icon clickable" />
              </div> */}
              {frag.name}
              <br />
              <span className="slightly-smaller-text" style={{ fontWeight: 400 }}>
                {frag.metadata?.description}
              </span>
            </Label>
          </>
        ))}
      </div>
      <Legend
        hasInaccessible={hasInaccessible}
        hasTemplateElements={hasTemplateElements}
        hasOutput={hasActions}
        outputText="Used in Actions"
      />
    </div>
  )
}
