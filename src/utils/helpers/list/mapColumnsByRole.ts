import {
  ApplicantActionCell,
  ApplicantCell,
  ApplicationNameCell,
  ApplicationNameReviewLinkCell,
  ConsolidatorCell,
  DeadlineCell,
  LastActiveDateCell,
  OrganisationCell,
  OutcomeCell,
  ReviewerActionCell,
  SerialNumberCell,
  StageCell,
  StatusCell,
} from '../../../components/List/Cells'
import { APPLICATION_COLUMNS, USER_ROLES } from '../../data'
import COLUMNS_PER_ROLE from '../../data/columnsPerUserRole'
import { ColumnDetails } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'

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

const useAllColumns = () => {
  const { strings } = useLanguageProvider()
  const allColumns: { [key in APPLICATION_COLUMNS]: ColumnDetails } = {
    SERIAL_NUMBER: {
      headerName: strings.COLUMN_SERIAL,
      sortName: 'serial',
      ColumnComponent: SerialNumberCell,
    },
    LAST_ACTIVE_DATE: {
      headerName: strings.COLUMN_LAST_ACTIVE_DATE,
      sortName: 'last-active-date',
      ColumnComponent: LastActiveDateCell,
    },
    DEADLINE_DATE: {
      headerName: strings.COLUMN_DEADLINE_DATE,
      sortName: '', // Not yet implemented
      ColumnComponent: DeadlineCell,
    },
    APPLICATION_NAME: {
      headerName: strings.COLUMN_APPLICATION,
      sortName: 'name',
      ColumnComponent: ApplicationNameCell,
    },
    APPLICATION_NAME_REVIEW_LINK: {
      headerName: strings.COLUMN_APPLICATION_REVIEW,
      sortName: 'name',
      ColumnComponent: ApplicationNameReviewLinkCell,
    },
    APPLICANT: {
      headerName: strings.COLUMN_APPLICANT,
      sortName: 'applicant',
      ColumnComponent: ApplicantCell,
    },
    ORGANISATION: {
      headerName: strings.COLUMN_ORGANISATION,
      sortName: 'org',
      ColumnComponent: OrganisationCell,
    },
    CONSOLIDATOR: {
      headerName: strings.COLUMN_CONSOLIDATOR,
      sortName: 'consolidator', // Not implemented in query
      ColumnComponent: ConsolidatorCell,
    },
    STAGE: {
      headerName: strings.COLUMN_STAGE,
      sortName: 'stage',
      ColumnComponent: StageCell,
    },
    STATUS: {
      headerName: strings.COLUMN_STATUS,
      sortName: 'status',
      ColumnComponent: StatusCell,
    },
    OUTCOME: {
      headerName: strings.COLUMN_OUTCOME,
      sortName: 'outcome',
      ColumnComponent: OutcomeCell,
    },
    REVIEWER_ACTION: {
      headerName: strings.COLUMN_REVIEWER_ACTION,
      sortName: 'outcome',
      ColumnComponent: ReviewerActionCell,
    },
    APPLICANT_ACTION: {
      headerName: strings.COLUMN_APPLICANT_ACTION,
      sortName: 'outcome',
      ColumnComponent: ApplicantActionCell,
    },
  }
  return allColumns
}

export default (userRoles: USER_ROLES): Array<ColumnDetails> => {
  const allColumns = useAllColumns()
  const columns: Array<ColumnDetails> = COLUMNS_PER_ROLE[userRoles].map((key) => allColumns[key])
  return columns
}
