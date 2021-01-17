import { APPLICATION_COLUMN, USER_ROLE } from '../../model'
import COLUMNS_PER_ROLE from '../../model/columnsPerUserRole'
import { ColumnDetails } from '../../types'
import ApplicationNameCell from '../../../components/List/ApplicationNameCell'
import StageCell from '../../../components/List/StageCell'
import StatusCell from '../../../components/List/StatusCell'
import OutcomeCell from '../../../components/List/OutcomeCell'

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
    headerName: 'Deadline date',
    filters: ['deadline-date'],
    ColumnComponent: ApplicationNameCell,
  },
  APPLICATION_NAME: {
    headerName: 'Name',
    filters: ['search'],
    ColumnComponent: ApplicationNameCell,
  },
  APPLICANT: {
    headerName: 'Applicant',
    filters: ['applicant'],
    ColumnComponent: ApplicationNameCell,
  },
  ORGANISATION: {
    headerName: 'Organisation',
    filters: ['org'],
    ColumnComponent: ApplicationNameCell,
  },
  CONSOLIDATOR: {
    headerName: 'Consolidator',
    filters: ['consolidator'],
    ColumnComponent: ApplicationNameCell,
  },
  STAGE: {
    headerName: 'Stage',
    filters: ['search', 'stage'],
    ColumnComponent: StageCell,
  },
  STATUS: {
    headerName: 'Status',
    filters: ['search', 'action'],
    ColumnComponent: StatusCell,
  },
  OUTCOME: {
    headerName: 'Outcome',
    filters: ['outcome'],
    ColumnComponent: OutcomeCell,
  },
}

export default (userRole: USER_ROLE): Array<ColumnDetails> => {
  const columns: Array<ColumnDetails> = COLUMNS_PER_ROLE[userRole].map((key) => allColumns[key])
  return columns
}
