import React, { useState } from 'react'
import { Button, Dropdown, Header, Icon } from 'semantic-ui-react'
import { useTemplateState } from '../../TemplateWrapper'
import DropdownIO from '../../../shared/DropdownIO'
import { FragmentFilter, useFragments } from './useManageFragments'
import { useOperationState } from '../../../shared/OperationContext'
import { JoinedEntityLabel, Legend } from '../shared'

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
          <a
            href="https://github.com/CarlosNZ/fig-tree-evaluator#fragments"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          <JoinedEntityLabel
            key={frag.name}
            joinId={frag.dataViewJoinId}
            name={frag.name}
            description={frag.metadata?.description}
            canEdit={template.canEdit}
            selected={frag.dataViewJoinId === selectedFragmentJoinId}
            inaccessible={!frag.applicantAccessible && !frag.inActions}
            inTemplateElements={frag.inTemplateElements}
            inActions={frag.inActions}
            editLink={`/admin/fragments?fragment=${frag.name}`}
            setSelected={setSelectedFragmentJoinId}
            setMenu={setMenuSelection}
          />
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
