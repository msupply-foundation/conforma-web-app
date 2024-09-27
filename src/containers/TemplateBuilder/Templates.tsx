/** @format */

import React, { ReactNode, useRef } from 'react'
import { useState } from 'react'
import {
  Button,
  Header,
  Icon,
  Table,
  Label,
  Dropdown,
  Checkbox,
  Confirm,
  Input,
} from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import OperationContext, { TemplateOptions, useOperationState } from './shared/OperationContext'
import TextIO from './shared/TextIO'
import useGetTemplates, { Template, type Templates } from './useGetTemplates'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import config from '../../config'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { DateTime } from 'luxon'
import { useToast } from '../../contexts/Toast'
import { isTemplateUnlocked, getTemplateVersionId, getVersionString } from './template/helpers'

type CellPropsTemplate = Template & { numberOfVersions?: number; totalApplicationCount?: number }
type CellProps = { template: CellPropsTemplate; refetch: () => void; isExpanded: boolean }

type Columns = {
  title: string
  render: (props: CellProps) => ReactNode
}[]

const columns: Columns = [
  {
    title: 'code',
    render: ({ template: { code, priority } }) => (
      <>
        <span>{code}</span>
        {priority && (
          <Label content={`Priority: ${priority}`} size="mini" style={{ marginLeft: 5 }} />
        )}
      </>
    ),
  },
  {
    title: 'name',
    render: ({ template: { name } }) => name,
  },

  {
    title: '',
    render: ({ template }) => (
      <React.Fragment key="version">
        <TextIO text={getVersionString(template)} title="version" maxLabelWidth={70} />
        <TextIO
          text={String(template.versionTimestamp.toLocaleString(DateTime.DATETIME_SHORT))}
          title="date"
          minLabelWidth={70}
        />
      </React.Fragment>
    ),
  },
  {
    title: 'category',
    render: ({ template: { category, categoryPriority } }) => (
      <>
        <span>{category}</span>
        {categoryPriority && (
          <>
            <br />
            <Label content={`Priority: ${categoryPriority}`} size="mini" />
          </>
        )}
      </>
    ),
  },
  {
    title: 'status',
    render: ({ template: { status } }) => status,
  },
  {
    title: '',
    render: ({
      template: { applicationCount, numberOfVersions, parentVersionId, totalApplicationCount },
      isExpanded,
    }) => (
      <React.Fragment key="counts">
        <TextIO
          text={String(isExpanded ? applicationCount : totalApplicationCount)}
          title="Applications"
          minLabelWidth={90}
        />
        {numberOfVersions && !isExpanded ? (
          <TextIO text={String(numberOfVersions)} title="Versions" minLabelWidth={90} />
        ) : (
          <TextIO text={parentVersionId ?? ''} title="Parent" minLabelWidth={90} />
        )}
      </React.Fragment>
    ),
  },
  {
    title: '',
    render: (cellProps) => (
      <div key="buttons">
        <ViewEditButton {...cellProps} />
        <ExportButton {...cellProps} />
        <DuplicateButton {...cellProps} />
      </div>
    ),
  },
]

const ViewEditButton: React.FC<CellProps> = ({ template: { id } }) => {
  const { push } = useRouter()

  return (
    <div
      key="edit"
      className="clickable"
      onClick={(e) => {
        e.stopPropagation()
        push(`/admin/template/${id}/general`, { queryString: location.search })
      }}
    >
      <Icon name="edit outline" />
    </div>
  )
}

const ExportButton: React.FC<CellProps> = ({ template }) => {
  const { exportTemplate, updateTemplate } = useOperationState()
  const { showToast } = useToast({
    style: 'success',
    title: 'Template exported',
    text: `${template.code} - ${getVersionString(template)}`,
  })
  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const [open, setOpen] = useState(false)
  const [commitMessage, setCommitMessage] = useState('')

  const doExport = async (versionId = template.versionId) => {
    const { code, versionHistory, id } = template
    const snapshotName = `${code}-${versionId}_v${versionHistory.length + 1}`
    if (await exportTemplate({ id, snapshotName })) {
      const res = await fetch(
        getServerUrl('snapshot', { action: 'download', name: snapshotName }),
        {
          headers: { Authorization: `Bearer ${JWT}` },
        }
      )
      const data = await res.blob()
      var a = document.createElement('a')
      a.href = window.URL.createObjectURL(data)
      a.download = `${snapshotName}.zip`
      a.click()
      // Delete the snapshot cos we don't want snapshots page cluttered
      // with individual templates
      await fetch(getServerUrl('snapshot', { action: 'delete', name: snapshotName }), {
        method: 'POST',
        headers: { Authorization: `Bearer ${JWT}` },
      })
      showToast()
    } else showToast({ style: 'error', title: 'Problem exporting template' })
  }

  return (
    <div key="export">
      <Confirm
        open={open}
        // Prevent click in Input from closing modal
        onClick={(e: any) => e.stopPropagation()}
        content={
          <div style={{ padding: 10, gap: 10 }} className="flex-column">
            <h2>Commit and export template?</h2>
            <p>
              By exporting this template now, you will be committing the current version. To make
              any further changes, you will need to duplicate it and start a new template version.
            </p>
            <div className="flex-row-start-center" style={{ gap: 10 }}>
              <label>Please provide a commit message:</label>
              <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                style={{ width: '60%' }}
              />
            </div>
          </div>
        }
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          const versionId = getTemplateVersionId()
          await updateTemplate(template as any, {
            versionId,
            versionComment: commitMessage,
            versionTimestamp: DateTime.now().toISO(),
          })
          setOpen(false)
          await doExport(versionId)
        }}
      />
      <div
        className="clickable"
        onClick={async (e) => {
          e.stopPropagation()
          if (isTemplateUnlocked(template)) setOpen(true)
          else doExport()
        }}
      >
        <Icon className="clickable" key="export" name="sign-out" />
      </div>
    </div>
  )
}

const DuplicateButton: React.FC<CellProps> = ({ template, refetch }) => {
  const { updateTemplate, duplicateTemplate } = useOperationState()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<'version' | 'template'>('version')
  const [newCode, setNewCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [commitCurrent, setCommitCurrent] = useState(isTemplateUnlocked(template))
  const [commitMessage, setCommitMessage] = useState('')
  const { showToast } = useToast({ style: 'success' })

  const { code, versionId } = template
  const snapshotName = `${code}-${versionId}`

  return (
    <div key="duplicate">
      <div
        className="clickable"
        onClick={async (e) => {
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Icon className="clickable" key="export" name="copy" />
      </div>
      <Confirm
        open={open}
        // Prevent click in Input from closing modal
        onClick={(e: any) => e.stopPropagation()}
        content={
          <div style={{ padding: 10, gap: 10 }} className="flex-column">
            <h2>Duplicate template</h2>
            <p>
              Do you want to create a new template version or a whole new template type based on
              this template?
            </p>
            <p>(New template will start with an empty version history)</p>
            <Dropdown
              selection
              options={[
                { key: 'version', value: 'version', text: 'Version' },
                { key: 'template', value: 'template', text: 'Template' },
              ]}
              value={selectedType}
              onChange={(_, { value }) => setSelectedType(value as 'version' | 'template')}
            />
            {selectedType === 'template' && (
              <div className="flex-row-start-center" style={{ gap: 10 }}>
                <label>New template code:</label>
                <Input
                  value={newCode}
                  onChange={(e) => {
                    setCodeError(false)
                    setNewCode(e.target.value)
                  }}
                  error={codeError}
                />
              </div>
            )}
            {isTemplateUnlocked(template) && (
              <Checkbox
                label="Commit current version?"
                checked={commitCurrent}
                onChange={(_) => setCommitCurrent(!commitCurrent)}
              />
            )}
            {commitCurrent && (
              <div className="flex-row-start-center" style={{ gap: 10 }}>
                <label>Commit message:</label>
                <Input
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  style={{ width: '80%' }}
                />
              </div>
            )}
          </div>
        }
        onCancel={() => setOpen(false)}
        onConfirm={async () => {
          if (selectedType === 'template' && newCode === '') {
            setCodeError(true)
            return
          }
          if (commitCurrent)
            await updateTemplate(template as any, {
              versionId: getTemplateVersionId(),
              versionComment: commitMessage,
              versionTimestamp: DateTime.now().toISO(),
            })
          setOpen(false)
          const templateOptions: TemplateOptions = {
            resetVersion: commitCurrent || !isTemplateUnlocked(template),
          }
          if (selectedType === 'template') templateOptions.newCode = newCode
          if (
            await duplicateTemplate({
              id: template.id,
              snapshotName,
              templates: templateOptions,
            })
          ) {
            showToast({
              title:
                selectedType === 'template'
                  ? 'New template created'
                  : 'New template version created',
              text: `${selectedType === 'template' ? newCode : template.code}`,
            })
            await refetch()
          }
        }}
      />
    </div>
  )
}

const TemplatesWrapper: React.FC = () => (
  <OperationContext>
    <Templates />
  </OperationContext>
)

type SortColumn = 'name' | 'code' | 'category' | 'status' | 'dashboard'

const Templates: React.FC = () => {
  const { t } = useLanguageProvider()
  const [expandedTemplates, setExpandedTemplates] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { templates, refetch } = useGetTemplates()
  const { importTemplate } = useOperationState()
  const { query, updateQuery } = useRouter()
  const [hideInactive, setHideInactive] = useState(query.hideInactive === 'true')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    query.categories ? query.categories.split(',').map((cat) => (cat === 'none' ? '' : cat)) : []
  )
  const [sortColumn, setSortColumn] = useState<SortColumn | undefined>(query.sort as SortColumn)
  const [sortAsc, setSortAsc] = useState<1 | -1>(query.desc === 'true' ? -1 : 1)

  const categoryOptions = Array.from(new Set(templates.map((template) => template.main.category)))
    .sort()
    .map((cat) => ({ key: cat, text: cat === '' ? '<No Category>' : cat, value: cat }))

  usePageTitle(t('PAGE_TITLE_TEMPLATES'))

  const changeSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortAsc(-sortAsc as 1 | -1)
      updateQuery({ desc: !query.desc })
      return
    }
    setSortColumn(column)
    setSortAsc(1)
    updateQuery({ sort: column, desc: false })
  }

  const renderHeader = () => (
    <Table.Header key="header">
      <Table.Row>
        {columns.map(({ title }, index) => (
          <Table.HeaderCell
            key={index}
            colSpan={1}
            onClick={() => changeSort(title as SortColumn)}
            sorted={title === sortColumn ? (sortAsc === 1 ? 'ascending' : 'descending') : undefined}
          >
            {title}
          </Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
  )

  const renderTemplate = (
    template: CellPropsTemplate,
    refetch: () => void,
    hasChildren = false
  ) => (
    <Table.Row
      className={hasChildren ? 'clickable' : ''}
      key={template.id}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (!hasChildren) return
        if (e.getModifierState('Meta') || e.getModifierState('Control')) {
          setExpandedTemplates([])
          return
        }
        if (expandedTemplates.includes(template.code))
          setExpandedTemplates(expandedTemplates.filter((el) => el !== template.code))
        else setExpandedTemplates([...expandedTemplates, template.code])
      }}
    >
      {columns.map(({ render }, cellIndex) => (
        <Table.Cell key={`selectedcell${cellIndex}`}>
          {render({ template, refetch, isExpanded: expandedTemplates.includes(template.code) })}
        </Table.Cell>
      ))}
    </Table.Row>
  )

  const renderInnerTemplates = (others: Template[], refetch: () => void) => (
    <Table.Row>
      <Table.Cell
        key={others[0].id}
        colSpan={7}
        style={{ background: 'transparent', paddingRight: 0, paddingLeft: 20 }}
      >
        <Table style={{ marginTop: -15, marginBottom: 0 }}>
          <Table.Body>{others.map((template) => renderTemplate(template, refetch))}</Table.Body>
        </Table>
      </Table.Cell>
    </Table.Row>
  )

  const renderImportButton = () => (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".zip"
        hidden
        name="file"
        multiple={false}
        onChange={async (e) => {
          if (await importTemplate(e)) refetch()
        }}
      />
      <Button inverted primary onClick={() => fileInputRef?.current?.click()}>
        Import
      </Button>
    </>
  )

  const sortedTemplates = sortTemplates(
    filterTemplates(templates, selectedCategories, hideInactive),
    sortColumn,
    sortAsc
  )

  return (
    <div className="template-builder-templates">
      <div key="top-bar" className="top-bar">
        <Header as="h3">Templates / Procedures</Header>
        <div className="flex-grow-1" />
        Key:
        <Label>
          <Icon name="edit" />
          Edit
        </Label>
        <Label>
          <Icon name="sign-out" />
          Export
        </Label>
        <Label>
          <Icon name="copy" />
          Duplicate
        </Label>
        {renderImportButton()}
      </div>
      <div className="flex-column-center">
        <div key="listContainer" id="list-container" className="outcome-table-container">
          <div className="flex-row-end" style={{ alignItems: 'center', gap: 20 }}>
            <Checkbox
              label="Show in Dashboard order"
              checked={sortColumn === 'dashboard'}
              toggle
              onChange={() => {
                if (sortColumn === 'dashboard') {
                  updateQuery({ sort: undefined })
                  setSortColumn(undefined)
                } else {
                  updateQuery({ sort: 'dashboard', desc: false })
                  setSortColumn('dashboard')
                }
              }}
            />
            <Checkbox
              label="Hide Inactive"
              checked={hideInactive}
              toggle
              onChange={() => {
                updateQuery({ hideInactive: !hideInactive })
                setHideInactive(!hideInactive)
              }}
            />
            <Dropdown
              placeholder="Filter by category"
              selection
              multiple
              value={selectedCategories}
              options={categoryOptions}
              onChange={(_, { value }) => {
                updateQuery({
                  categories: (value as string[])
                    .map((cat) => (cat === '' ? 'none' : cat))
                    .join(','),
                })
                setSelectedCategories(value as string[])
              }}
              style={{ maxWidth: 350 }}
            />
          </div>
          <Table sortable stackable selectable>
            {renderHeader()}
            <Table.Body key="body">
              {sortedTemplates.map(
                ({ others, main, totalApplicationCount, numberOfVersions }, rowIndex) => (
                  <React.Fragment key={`fragment_${rowIndex}`}>
                    {renderTemplate(
                      { ...main, totalApplicationCount: totalApplicationCount, numberOfVersions },
                      refetch,
                      others.length > 0
                    )}
                    {expandedTemplates.includes(main.code) && renderInnerTemplates(others, refetch)}
                  </React.Fragment>
                )
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default TemplatesWrapper

const filterTemplates = (templates: Templates, categories: string[], hideInactive: boolean) => {
  const categoryFiltered =
    categories.length === 0
      ? templates
      : templates.filter(({ main }) => categories.includes(main.category))
  return hideInactive
    ? categoryFiltered.filter((template) => template.main.status === 'AVAILABLE')
    : categoryFiltered
}

const sortTemplates = (
  templates: Templates,
  sortColumn: SortColumn | undefined,
  sortAsc: 1 | -1
) => {
  if (!sortColumn) return templates

  if (sortColumn === 'dashboard') {
    return [...templates].sort((a, b) => {
      if (a.main.category === b.main.category) {
        if (!a.main.priority && !b.main.priority) return b.main.name > a.main.name ? -1 : 1
        return (b.main.priority ?? 0) - (a.main.priority ?? 0)
      }
      if (!a.main.categoryPriority && !b.main.categoryPriority) {
        if (a.main.category === b.main.category) return 0
        return b.main.category > a.main.category ? -1 : 1
      }
      return (b.main.categoryPriority ?? 0) - (a.main.categoryPriority ?? 0)
    })
  }

  return [...templates].sort((a, b) => {
    const aVal = a.main[sortColumn]
    const bVal = b.main[sortColumn]
    if (aVal === bVal) return 0
    return sortAsc * (aVal > bVal ? 1 : -1)
  })
}
