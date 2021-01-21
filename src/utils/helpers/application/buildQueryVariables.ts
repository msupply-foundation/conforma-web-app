import { ApplicationListsOrderBy } from '../../../utils/generated/graphql'

export default function buildSortFields(sortString: string) {
  const sortFields = sortString.split(',')
  return sortFields.map((field) => getGraphQLSortName(field))
}

const getGraphQLSortName = (field: string) => {
  const [fieldName, direction] = field.split(':')
  return (mapSortFields[fieldName] +
    (direction === 'asc' ? 'ASC' : 'DESC')) as ApplicationListsOrderBy
}

const mapSortFields: any = {
  type: 'TEMPLATE_NAME_',
  serial: 'SERIAL_',
  name: 'NAME_',
  code: 'TEMPLATE_CODE_',
  applicant: 'APPLICANT_',
  username: 'APPLICANT_USERNAME_',
  org: 'ORG_NAME_',
  stage: 'STAGE_',
  status: 'STATUS_',
  outcome: 'OUTCOME_',
  lastActiveDate: 'LAST_ACTIVE_DATE_',
}

type PaginationValues = {
  numberToFetch: number
  paginationOffset: number
}

export function getPaginationVariables(page: number, perPage = 20): PaginationValues {
  return { numberToFetch: perPage, paginationOffset: (page - 1) * perPage }
}
