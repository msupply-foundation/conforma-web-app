import React, { ReactNode, useRef } from 'react'
import { useState } from 'react'
import { Button, Header, Icon, Table, Label, Dropdown, Checkbox } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import OperationContext, { useOperationState } from './shared/OperationContext'
import TextIO from './shared/TextIO'
import useGetTemplates, { Template, Templates } from './useGetTemplates'
import { useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import config from '../../config'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'

type CellPropsTemplate = Template & { numberOfTemplates?: number }
type CellProps = { template: CellPropsTemplate; refetch: () => void }

type Columns = {
  title: string
  render: (props: CellProps) => ReactNode
}[]

const columns: Columns = [
  {
    title: 'code',
    render: ({ template: { code } }) => code,
  },
  {
    title: 'name',
    render: ({ template: { name } }) => name,
  },

  {
    title: '',
    render: ({ template: { version, versionTimestamp } }) => (
      <React.Fragment key="version">
        <TextIO text={String(version)} title="version" maxLabelWidth={70} />
        <TextIO
          text={String(versionTimestamp.toFormat('dd MMM yy'))}
          title="date"
          minLabelWidth={70}
        />
      </React.Fragment>
    ),
  },
  {
    title: 'category',
    render: ({ template: { category } }) => category,
  },
  {
    title: 'status',
    render: ({ template: { status } }) => status,
  },
  {
    title: '',
    render: ({ template: { applicationCount, numberOfTemplates } }) => (
      <React.Fragment key="counts">
        <TextIO text={String(applicationCount)} title="Applications" minLabelWidth={90} />
        {numberOfTemplates && (
          <TextIO text={String(numberOfTemplates)} title="Templates" minLabelWidth={90} />
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
        push(`/admin/template/${id}/general`)
      }}
    >
      <Icon name="edit outline" />
    </div>
  )
}

const ExportButton: React.FC<CellProps> = ({ template: { code, version, id } }) => {
  const { exportTemplate } = useOperationState()
  const snapshotName = `${code}-${version}`
  const JWT = localStorage.getItem(config.localStorageJWTKey)

  return (
    <div key="export">
      <div
        className="clickable"
        onClick={async (e) => {
          e.stopPropagation()
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
          }
        }}
      >
        <Icon className="clickable" key="export" name="sign-out" />
      </div>
    </div>
  )
}

const DuplicateButton: React.FC<CellProps> = ({ template: { code, version, id }, refetch }) => {
  const snapshotName = `${code}-${version}`
  const { duplicateTemplate } = useOperationState()

  return (
    <div key="duplicate">
      <div
        className="clickable"
        onClick={async (e) => {
          e.stopPropagation()
          if (await duplicateTemplate({ id, snapshotName })) refetch()
        }}
      >
        <Icon className="clickable" key="export" name="copy" />
      </div>
    </div>
  )
}

const TemplatesWrapper: React.FC = () => (
  <OperationContext>
    <Templates />
  </OperationContext>
)

type SortColumn = 'name' | 'code' | 'category' | 'status'

const Templates: React.FC = () => {
  const { t } = useLanguageProvider()
  const [selectedRow, setSelectedRow] = useState(-1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { templates, refetch } = useGetTemplates()
  const { importTemplate } = useOperationState()
  const [hideInactive, setHideInactive] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<SortColumn>()
  const [sortAsc, setSortAsc] = useState<1 | -1>(1)

  const categoryOptions = Array.from(new Set(templates.map((template) => template.main.category)))
    .sort()
    .map((cat) => ({ key: cat, text: cat === '' ? '<No Category>' : cat, value: cat }))

  usePageTitle(t('PAGE_TITLE_TEMPLATES'))

  const changeSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortAsc(-sortAsc as 1 | -1)
      return
    }
    setSortColumn(column)
    setSortAsc(1)
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
    rowIndex: number,
    isInnerRender = false
  ) => {
    if (rowIndex === selectedRow && !isInnerRender) return null

    return (
      <Table.Row
        key={`notselected${rowIndex}`}
        className="clickable"
        onClick={() => setSelectedRow(rowIndex)}
      >
        {columns.map(({ render }, cellIndex) => (
          <Table.Cell key={`selectedcell${cellIndex}`}>{render({ template, refetch })}</Table.Cell>
        ))}
      </Table.Row>
    )
  }

  const renderInnerTemplates = (all: Template[], refetch: () => void, rowIndex: number) => {
    if (rowIndex !== selectedRow) return null
    return (
      <>
        <Table.Row
          key={`selected_${rowIndex}`}
          className="clickable collapsed-start-row"
          onClick={() => setSelectedRow(-1)}
        >
          <td colSpan={columns.length}>
            <Icon name="angle up" />
          </td>
        </Table.Row>
        {all.map((template, innerRowIndex) =>
          renderTemplate(template, refetch, innerRowIndex, true)
        )}
        <Table.Row className="collapsed-end-row" key={`${rowIndex}-end`}>
          <td colSpan={columns.length}></td>
        </Table.Row>
      </>
    )
  }

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
              label="Hide Inactive"
              toggle
              onChange={() => setHideInactive(!hideInactive)}
            />
            <Dropdown
              placeholder="Filter by category"
              selection
              multiple
              options={categoryOptions}
              onChange={(_, { value }) => setSelectedCategories(value as string[])}
              style={{ maxWidth: 350 }}
            />
          </div>
          <Table sortable stackable selectable>
            {renderHeader()}
            <Table.Body key="body">
              {sortTemplates(
                filterTemplates(templates, selectedCategories, hideInactive),
                sortColumn,
                sortAsc
              ).map(({ all, main, applicationCount, numberOfTemplates }, rowIndex) => (
                <React.Fragment key={`fragment_${rowIndex}`}>
                  {renderTemplate(
                    { ...main, applicationCount, numberOfTemplates },
                    refetch,
                    rowIndex
                  )}
                  {renderInnerTemplates(all, refetch, rowIndex)}
                </React.Fragment>
              ))}
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
  return templates.sort((a, b) => {
    const aVal = a.main[sortColumn]
    const bVal = b.main[sortColumn]
    if (aVal === bVal) return 0
    return sortAsc * (aVal > bVal ? 1 : -1)
  })
}
