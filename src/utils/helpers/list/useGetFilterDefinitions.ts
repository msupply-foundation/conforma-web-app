import { DocumentNode } from 'graphql'
import { DateTime, DurationObjectUnits } from 'luxon'
import { today } from '../../dateAndTime/parseDateRange'
import {
  ApplicationOutcome,
  ApplicationStatus,
  AssignerAction,
  ReviewerAction,
} from '../../generated/graphql'
import getApplicantFilterList from '../../graphql/queries/applicationListFilters/getApplicantFilterList'
import getAssignerFilterList from '../../graphql/queries/applicationListFilters/getAssignerFilterList'
import getOrganisationFilterList from '../../graphql/queries/applicationListFilters/getOrganisationFilterList'
import getReviewersFilterList from '../../graphql/queries/applicationListFilters/getReviewersFilterList'
import getStageFilterList from '../../graphql/queries/applicationListFilters/getStageFilterList'
import { FilterDefinitions, GetFilterListQuery, NamedDates } from '../../types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { USER_ROLES } from '../../data'
import { usePrefs } from '../../../contexts/SystemPrefs'

export const useGetFilterDefinitions = () => {
  const { strings } = useLanguageProvider()

  const { preferences } = usePrefs()

  const defaultFilters = preferences?.defaultListFilters || []

  const NAMED_DATE_RANGES: NamedDates = {
    today: { getDates: () => [today(), today()], title: strings.FILTER_NAMED_DATE_TODAY },
    yesterday: {
      getDates: () => getDateRangeForUnit('day', -1),
      title: strings.FILTER_NAMED_DATE_YESTERDAY,
    },
    'this-week': {
      getDates: () => getDateRangeForUnit('week'),
      title: strings.FILTER_NAMED_DATE_THIS_WEEK,
    },
    'last-week': {
      getDates: () => getDateRangeForUnit('week', -1),
      title: strings.FILTER_NAMED_DATE_LAST_WEEK,
    },
    'this-month': {
      getDates: () => getDateRangeForUnit('month'),
      title: strings.FILTER_NAMED_DATE_THIS_MONTH,
    },
    'last-month': {
      getDates: () => getDateRangeForUnit('month', -1),

      title: strings.FILTER_NAMED_DATE_LAST_MONTH,
    },
    'next-month': {
      getDates: () => getDateRangeForUnit('month', 1),
      title: strings.FILTER_NAMED_DATE_NEXT_MONTH,
    },
    'this-year': {
      getDates: () => getDateRangeForUnit('year'),
      title: strings.FILTER_NAMED_DATE_THIS_YEAR,
    },
    'last-year': {
      getDates: () => getDateRangeForUnit('year', -1),
      title: strings.FILTER_NAMED_DATE_LAST_YEAR,
    },
    'next-year': {
      getDates: () => getDateRangeForUnit('year', 1),
      title: strings.FILTER_NAMED_DATE_NEXT_YEAR,
    },
  }

  const FILTER_DEFINITIONS: FilterDefinitions = {
    lastActiveDate: {
      type: 'date',
      default: defaultFilters.some((filter) => filter === 'lastActiveDate'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER],
      title: strings.FILTER_LAST_ACTIVE,
      options: { namedDates: NAMED_DATE_RANGES },
    },
    applicantDeadline: {
      type: 'date',
      default: defaultFilters.some((filter) => filter === 'applicantDeadline'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER],
      title: strings.FILTER_APPLICANT_DEADLINE,
      options: { namedDates: NAMED_DATE_RANGES },
    },
    type: {
      type: 'equals',
      default: defaultFilters.some((filter) => filter === 'type'),
      visibleTo: [],
      options: { substituteColumnName: 'templateCode' },
    },
    status: {
      type: 'enumList',
      default: defaultFilters.some((filter) => filter === 'status'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER],
      title: strings.FILTER_STATUS,
      options: { enumList: Object.values(ApplicationStatus) },
    },
    outcome: {
      type: 'enumList',
      default: defaultFilters.some((filter) => filter === 'outcome'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER],
      title: strings.FILTER_OUTCOME,
      options: { enumList: Object.values(ApplicationOutcome) },
    },
    orgName: {
      type: 'searchableListIn',
      default: defaultFilters.some((filter) => filter === 'org'),
      visibleTo: [USER_ROLES.REVIEWER],
      title: strings.FILTER_ORGANISATION,
      options: {
        getListQuery: constructFilterListQuery(
          getOrganisationFilterList,
          'applicationListFilterOrganisation'
        ),
      },
    },
    stage: {
      type: 'staticList',
      default: defaultFilters.some((filter) => filter === 'stage'),
      visibleTo: [USER_ROLES.REVIEWER],
      title: strings.FILTER_STAGE,
      options: {
        getListQuery: constructFilterListQuery(getStageFilterList, 'applicationListFilterStage'),
      },
    },
    search: {
      type: 'search',
      default: defaultFilters.some((filter) => filter === 'search'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER], // Always Visible
      options: {
        orFieldNames: ['name', 'applicant', 'orgName', 'templateName', 'stage'],
      },
    },
    applicant: {
      type: 'searchableListIn',
      default: defaultFilters.some((filter) => filter === 'applicant'),
      visibleTo: [USER_ROLES.APPLICANT, USER_ROLES.REVIEWER],
      title: strings.FILTER_APPLICANT,
      options: {
        getListQuery: constructFilterListQuery(
          getApplicantFilterList,
          'applicationListFilterApplicant'
        ),
      },
    },
    assigners: {
      type: 'searchableListInArray',
      default: defaultFilters.some((filter) => filter === 'assigner'),
      visibleTo: [USER_ROLES.REVIEWER],
      title: strings.FILTER_ASSIGNER,
      options: {
        getListQuery: constructFilterListQuery(
          getAssignerFilterList,
          'applicationListFilterAssigner'
        ),
      },
    },
    reviewers: {
      type: 'searchableListInArray',
      default: defaultFilters.some((filter) => filter === 'reviewers'),
      visibleTo: [USER_ROLES.REVIEWER],
      title: strings.FILTER_REVIEWER,
      options: {
        getListQuery: constructFilterListQuery(
          getReviewersFilterList,
          'applicationListFilterReviewer'
        ),
      },
    },
    assignerAction: {
      type: 'enumList',
      default: defaultFilters.some((filter) => filter === 'assignerAction'),
      visibleTo: [],
      title: strings.FILTER_ASSIGNER_ACTION,
      options: { enumList: Object.values(AssignerAction) },
    },
    reviewerAction: {
      type: 'enumList',
      default: defaultFilters.some((filter) => filter === 'reviewerAction'),
      visibleTo: [USER_ROLES.REVIEWER],
      title: strings.FILTER_REVIEWER_ACTION,
      options: { enumList: Object.values(ReviewerAction) },
    },
    // isFullyAssignedLevel1: {
    //   type: 'boolean',
    //   title: strings.FILTER_ASSIGNMENT_STATUS,
    //   options: {
    //     booleanMapping: {
    //       true: strings.FILTER_ASSIGNMENT_STATUS_TRUE,
    //       false: strings.FILTER_ASSIGNMENT_STATUS_FALSE,
    //     },
    //   },
    // },
    // reviewersAssignedCount: {
    //   type: 'number',
    // },
  }
  return FILTER_DEFINITIONS
}

export const constructFilterListQuery = (query: DocumentNode, queryMethod: string) => {
  const getListQuery: GetFilterListQuery = ({ searchValue, filterListParameters }) => {
    const { templateCode = '' } = filterListParameters || {}
    console.log('filterListParameters', filterListParameters)
    return {
      query,
      variables: {
        searchValue,
        templateCode,
      },
      resultExtractor: (resultQuery) => ({
        list: resultQuery?.[queryMethod]?.nodes || [],
        totalCount: resultQuery?.[queryMethod]?.totalCount || 0,
      }),
    }
  }
  return getListQuery
}

type GetDateRangeForUnit = (unit: keyof DurationObjectUnits, value?: number) => [DateTime, DateTime]

const getDateRangeForUnit: GetDateRangeForUnit = (unit, value = 0) => {
  if (value === 0) return [today().startOf(unit), today().endOf(unit).startOf('day')]

  return [
    today()
      [value < 0 ? 'minus' : 'plus']({ [unit]: Math.abs(value) })
      .startOf(unit),
    today()
      [value < 0 ? 'minus' : 'plus']({ [unit]: Math.abs(value) })
      .endOf(unit)
      .startOf('day'),
  ]
}
