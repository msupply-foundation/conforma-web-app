import { APPLICATION_COLUMN, USER_ROLE } from '../../model'
import COLUMNS_PER_ROLE from '../../model/columnsPerUserRole'
import { ColumnDetails } from '../../types'
import ApplicationNameCell from '../../../components/List/ApplicationNameCell'

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

const allColumns: { [key in APPLICATION_COLUMN]: ColumnDetails } = {
  LAST_ACTIVE_DATE: {
    headerName: 'Last active date',
    filters: ['last-active-date'],
    ColumnComponent: ApplicationNameCell,
  },
  DEADLINE_DATE: {
    headerName: APPLICATION_COLUMN.DEADLINE_DATE,
    filters: ['deadline-date'],
    ColumnComponent: ApplicationNameCell,
  },
  APPLICATION_NAME: {
    headerName: APPLICATION_COLUMN.APPLICATION_NAME,
    filters: ['search'],
    ColumnComponent: ApplicationNameCell,
  },
  APPLICANT: {
    headerName: APPLICATION_COLUMN.APPLICANT,
    filters: ['applicant'],
    ColumnComponent: ApplicationNameCell,
  },
  COMPANY: {
    headerName: APPLICATION_COLUMN.COMPANY,
    filters: ['org'],
    ColumnComponent: ApplicationNameCell,
  },
  CONSOLIDATOR: {
    headerName: APPLICATION_COLUMN.CONSOLIDATOR,
    filters: ['consolidator'],
    ColumnComponent: ApplicationNameCell,
  },
  STAGE: {
    headerName: APPLICATION_COLUMN.STAGE,
    filters: ['search', 'stage'],
    ColumnComponent: ApplicationNameCell,
  },
  STATUS: {
    headerName: APPLICATION_COLUMN.STATUS,
    filters: ['search'],
    ColumnComponent: ApplicationNameCell,
  },
  ACTIONABLE: {
    headerName: '',
    filters: ['search', 'action'],
    ColumnComponent: ApplicationNameCell,
  },
}

export default (userRole: USER_ROLE): Array<ColumnDetails> => {
  const columns: Array<ColumnDetails> = COLUMNS_PER_ROLE[userRole].map((key) => allColumns[key])
  return columns
}
