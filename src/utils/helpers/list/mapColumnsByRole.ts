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
import { LIST_COLUMNS, USER_ROLES } from '../../data'
import COLUMNS_PER_ROLE from '../../data/columnsPerUserRole'
import { ColumnDetails } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { ApplicationOutcome, ApplicationStatus } from '../../generated/graphql'

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

export const useMapColumnsByRole = () => {
  const { t } = useLanguageProvider()
  const allColumns: { [key in LIST_COLUMNS]: ColumnDetails } = {
    SERIAL_NUMBER: {
      headerName: t('COLUMN_SERIAL'),
      sortName: 'serial',
      ColumnComponent: SerialNumberCell,
      hideMobileLabel: true,
    },
    LAST_ACTIVE_DATE: {
      headerName: t('COLUMN_LAST_ACTIVE_DATE'),
      headerDetail: t('COLUMN_LAST_ACTIVE_DATE_TOOLTIP'),
      sortName: 'last-active-date',
      ColumnComponent: LastActiveDateCell,
    },
    DEADLINE_DATE: {
      headerName: t('COLUMN_DEADLINE_DATE'),
      headerDetail: t('COLUMN_DEADLINE_DATE_TOOLTIP'),
      sortName: 'applicant-deadline',
      ColumnComponent: DeadlineCell,
      hideOnMobileTest: (application) => !application.applicantDeadline,
    },
    APPLICATION_NAME: {
      headerName: t('COLUMN_APPLICATION'),
      sortName: 'name',
      ColumnComponent: ApplicationNameCell,
      hideMobileLabel: true,
    },
    APPLICATION_NAME_REVIEW_LINK: {
      headerName: t('COLUMN_APPLICATION_REVIEW'),
      sortName: 'name',
      ColumnComponent: ApplicationNameReviewLinkCell,
      hideMobileLabel: true,
    },
    APPLICANT: {
      headerName: t('COLUMN_APPLICANT'),
      sortName: 'applicant',
      ColumnComponent: ApplicantCell,
    },
    ORGANISATION: {
      headerName: t('COLUMN_ORGANISATION'),
      sortName: 'org',
      ColumnComponent: OrganisationCell,
    },
    CONSOLIDATOR: {
      headerName: t('COLUMN_CONSOLIDATOR'),
      sortName: 'consolidator', // Not implemented in query
      ColumnComponent: ConsolidatorCell,
    },
    STAGE: {
      headerName: t('COLUMN_STAGE'),
      sortName: 'stage',
      ColumnComponent: StageCell,
      hideMobileLabel: true,
    },
    STATUS: {
      headerName: t('COLUMN_STATUS'),
      sortName: 'status',
      ColumnComponent: StatusCell,
      hideMobileLabel: true,
      hideOnMobileTest: (application) =>
        application.status !== ApplicationStatus.ChangesRequired &&
        application.status !== ApplicationStatus.Draft,
    },
    OUTCOME: {
      headerName: t('COLUMN_OUTCOME'),
      sortName: 'outcome',
      ColumnComponent: OutcomeCell,
      hideMobileLabel: true,
      hideOnMobileTest: (application) => application.outcome === ApplicationOutcome.Pending,
    },
    REVIEWER_ACTION: {
      headerName: t('COLUMN_REVIEWER_ACTION'),
      sortName: '',
      ColumnComponent: ReviewerActionCell,
      hideMobileLabel: true,
      hideOnMobileTest: (application) => !application.reviewerAction,
    },
    APPLICANT_ACTION: {
      headerName: t('COLUMN_APPLICANT_ACTION'),
      sortName: '',
      ColumnComponent: ApplicantActionCell,
      hideOnMobileTest: (_) => true,
    },
  }

  const mapColumnsByRole = (userRoles: USER_ROLES): ColumnDetails[] => {
    const columns: ColumnDetails[] = COLUMNS_PER_ROLE[userRoles].map((key) => allColumns[key])
    return columns
  }
  return mapColumnsByRole
}
