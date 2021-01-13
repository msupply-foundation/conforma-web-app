enum APPLICATION_COLUMN {
  LAST_ACTIVE_DATE = 'Last active date',
  DEADLINE_DATE = 'Deadline date',
  APPLICATION_NAME = 'Application name',
  APPLICANT = 'Applicant',
  COMPANY = 'Company',
  CONSOLIDATOR = 'Consolidator',
  STAGE = 'Stage',
  STATUS = 'Status',
  ACTIONABLE = 'Actionable',
}

interface ColumnDetails {
  headerName: string
  filters: null | string | Array<string>
  render?: Function
}

const allColumns: Array<ColumnDetails> = [
  {
    headerName: APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    filters: 'last-active-date',
  },
  {
    headerName: APPLICATION_COLUMN.DEADLINE_DATE,
    filters: 'deadline-date',
  },
  {
    headerName: APPLICATION_COLUMN.APPLICATION_NAME,
    filters: 'search',
  },
  {
    headerName: APPLICATION_COLUMN.APPLICANT,
    filters: 'applicant',
  },
  {
    headerName: APPLICATION_COLUMN.COMPANY,
    filters: 'org',
  },
  {
    headerName: APPLICATION_COLUMN.CONSOLIDATOR,
    filters: 'consolidator',
  },
  {
    headerName: APPLICATION_COLUMN.STAGE,
    filters: ['search', 'stage'],
  },
  {
    headerName: APPLICATION_COLUMN.STATUS,
    filters: 'search',
  },
  {
    headerName: '',
    filters: ['search', 'action'],
  },
]

interface ColumnsPerRole {
  [role: string]: Array<string>
}

const columnsPerRole: ColumnsPerRole = {
  applicant: [
    APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    APPLICATION_COLUMN.DEADLINE_DATE,
    APPLICATION_COLUMN.APPLICATION_NAME,
    APPLICATION_COLUMN.STAGE,
    APPLICATION_COLUMN.STATUS,
    APPLICATION_COLUMN.ACTIONABLE,
  ],
  reviewer1: [
    APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    APPLICATION_COLUMN.APPLICATION_NAME,
    APPLICATION_COLUMN.APPLICANT,
    APPLICATION_COLUMN.CONSOLIDATOR,
    APPLICATION_COLUMN.STAGE,
    APPLICATION_COLUMN.STATUS,
  ],
  reviewer2: [
    APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    APPLICATION_COLUMN.APPLICATION_NAME,
    APPLICATION_COLUMN.APPLICANT,
    APPLICATION_COLUMN.CONSOLIDATOR,
    APPLICATION_COLUMN.STAGE,
    APPLICATION_COLUMN.STATUS,
  ],
  supervisor: [
    APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    APPLICATION_COLUMN.APPLICATION_NAME,
    APPLICATION_COLUMN.APPLICANT,
    APPLICATION_COLUMN.STATUS,
  ],
  consolidator: [
    APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    APPLICATION_COLUMN.APPLICATION_NAME,
    APPLICATION_COLUMN.APPLICANT,
    APPLICATION_COLUMN.STATUS,
  ],
}

export default (userRole: string): Array<ColumnDetails> => {
  const columns: Array<ColumnDetails> = allColumns.filter(({ headerName }) =>
    columnsPerRole[userRole] ? columnsPerRole[userRole].includes(headerName) : false
  )
  return columns
}
