import { APPLICATION_COLUMN, USER_ROLE } from '../../model'
import COLUMNS_PER_ROLE from '../../model/columnsPerUserRole'
/**
 * @function: mapColumnsByRole
 * Map object with all columns to be displayed - based on the current user Role.
 * In each column details has the defining of the header title, possible filter keys and
 * a render function (To be done in another issue).
 * The render function will return the component to be rendered in each cell in this column
 * using the application in the row props.
 * - @param userRole - Current user role - as string (TODO: Use type)
 * - @returns Object with each Column details to construct header and rows of applications list.s
 */

interface ColumnDetails {
  headerName: string
  filters: null | string | Array<string>
  render?: Function
}

const allColumns = {
  LAST_ACTIVE_DATE: {
    headerName: APPLICATION_COLUMN.LAST_ACTIVE_DATE,
    filters: 'last-active-date',
  },
  DEADLINE_DATE: {
    headerName: APPLICATION_COLUMN.DEADLINE_DATE,
    filters: 'deadline-date',
  },
  APPLICATION_NAME: {
    headerName: APPLICATION_COLUMN.APPLICATION_NAME,
    filters: 'search',
  },
  APPLICANT: {
    headerName: APPLICATION_COLUMN.APPLICANT,
    filters: 'applicant',
  },
  COMPANY: {
    headerName: APPLICATION_COLUMN.COMPANY,
    filters: 'org',
  },
  CONSOLIDATOR: {
    headerName: APPLICATION_COLUMN.CONSOLIDATOR,
    filters: 'consolidator',
  },
  STAGE: {
    headerName: APPLICATION_COLUMN.STAGE,
    filters: ['search', 'stage'],
  },
  STATUS: {
    headerName: APPLICATION_COLUMN.STATUS,
    filters: 'search',
  },
  ACTIONABLE: {
    headerName: '',
    filters: ['search', 'action'],
  },
}

export default (userRole: USER_ROLE): Array<ColumnDetails> => {
  const columns: Array<ColumnDetails> = COLUMNS_PER_ROLE[userRole].map((key) => allColumns[key])
  return columns
}
