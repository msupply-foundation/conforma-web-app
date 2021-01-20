import { DateTime } from 'luxon'
import { URLQueryFilter } from '../../hooks/useListApplications'

export default function buildQueryFilters(filters: URLQueryFilter) {
  const graphQLfilter = Object.entries(filters).reduce((filterObj, [key, value]) => {
    if (!mapQueryToFilterField?.[key]) return filterObj
    return { ...filterObj, ...mapQueryToFilterField[key](value) }
  }, {})
  return graphQLfilter
}

interface FilterMap {
  [key: string]: (value: string) => object
}

const mapQueryToFilterField: FilterMap = {
  type: (value: string) => {
    return {
      template: {
        code: { equalToInsensitive: value },
        status: { equalTo: 'AVAILABLE' },
      },
    }
  },
  // category -- not yet implemented in schema
  stage: (values: string) => {
    return {
      stage: inList(values),
    }
  },
  status: (values: string) => {
    // To-Do: gracefully handle values that don't match Enum -- currently breaks query
    return { status: inEnumList(values) }
  },
  outcome: (values: string) => {
    return { outcome: inEnumList(values) }
  },
  // action
  // assigned
  // consolidator
  applicant: (values: string) => {
    return {
      or: [
        { user: { username: { inInsensitive: splitCommaList(values) } } },
        { user: { firstName: { inInsensitive: splitCommaList(values) } } },
        { user: { lastName: { inInsensitive: splitCommaList(values) } } },
      ],
    }
  },
  // org -- not yet implemented, see back-end issue #179
  lastActiveDate: (value: string) => {
    const [startDate, endDate] = parseDateString(value)
    console.log('Dates:', startDate, endDate)
    return {
      applicationStageHistories: {
        every: {
          timeCreated: {
            greaterThanOrEqualTo: startDate,
            lessThanOrEqualTo: endDate,
          },
          isCurrent: { equalTo: true },
        },
      },
    }
  },
  // deadlineDate (TBD)
  search: (value: string) => {
    return {
      or: [
        { name: { includesInsensitive: value } },
        { user: { username: { includesInsensitive: value } } },
        { user: { firstName: { includesInsensitive: value } } },
        { user: { lastName: { includesInsensitive: value } } },
        { stage: { startsWithInsensitive: value } },
      ],
    }
  },
}

const splitCommaList = (values: string) => values.split(',')

// Use this if the values can be free text strings (e.g. stage name)
const inList = (values: string) => {
  return { inInsensitive: splitCommaList(values) }
}

// Use this if the values must conform to an Enum type (e.g. status)
const inEnumList = (values: string) => {
  return { in: splitCommaList(values).map((value) => value.toUpperCase()) }
}

const parseDateString = (dateString: string) => {
  if (mapNamedDates?.[dateString]) return mapNamedDates[dateString]
  const [startDate, endDate] = dateString.split(':')
  if (endDate === undefined)
    // Exact date -- add 1 to cover until start of the next day
    return [startDate, datePlusDays(1, startDate)]
  if (endDate === '') return [startDate, null] // No end date boundary
  if (startDate === '') return [null, endDate] // No start date boundary
  return [startDate, endDate]
}

const datePlusDays = (offset = 0, dateString: string | undefined = undefined) => {
  if (dateString) return DateTime.fromISO(dateString).plus({ days: offset }).toISODate()
  return DateTime.local().plus({ days: offset }).toISODate()
}

interface NamedDateMap {
  [key: string]: string[]
}

const mapNamedDates: NamedDateMap = {
  today: [datePlusDays(), datePlusDays(1)],
  yesterday: [datePlusDays(-1), datePlusDays()],
  'this-week': [datePlusDays(-7), datePlusDays(1)],
  // TO-DO:
  //  last-week,
  //  this-month,
  //  last-month,
  //  this-quarter,
  //  last-quarter,
  //  this-year,
  //  last-year
  //  etc...
}
