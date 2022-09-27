import { parseDateRange, formatDateGraphQl } from '../../dateAndTime/parseDateRange'
import {
  BasicStringObject,
  FilterDefinition,
  FilterDefinitions,
  FilterTypeDefinitions,
  GqlFilterObject,
} from '../../types'

export default function buildQueryFilters(
  filters: BasicStringObject,
  filterDefinitions: FilterDefinitions
) {
  const graphQLfilter = Object.entries(filters).reduce((filterObj, [filterName, filterValue]) => {
    const filterDefinition = filterDefinitions[filterName]
    if (!filterDefinition) return filterObj
    const filter = constructFilter(filterDefinition, filterName, filterValue)
    // If "or" field exists, we need to merge them, otherwise newer one will
    // overwrite previous
    if ('or' in filterObj && 'or' in filter)
      return {
        ...(filterObj as GqlFilterObject),
        or: [...(filterObj as GqlFilterObject).or, ...(filter as GqlFilterObject).or],
      }
    return { ...filterObj, ...filter }
  }, {})

  return graphQLfilter
}

// Defines how string filter are transfered to graphQL filter for each type
const filterTypeDefinitions: FilterTypeDefinitions = {
  number: (filterValue) => {
    const [fromNumber, toNumber] = filterValue.split(':')
    const greaterThanOrEqualTo = fromNumber ? fromNumber : undefined
    const lessThanOrEqualTo = toNumber ? toNumber : undefined

    return { greaterThanOrEqualTo, lessThanOrEqualTo }
  },
  date: (filterValue, options) => {
    const { startDate, endDate } = parseDateRange(filterValue, options?.namedDates)
    const greaterThanOrEqualTo = startDate.date ? formatDateGraphQl(startDate.date) : undefined
    const lessThan = endDate.date ? formatDateGraphQl(endDate.date.plus({ day: 1 })) : undefined
    return { greaterThanOrEqualTo, lessThan }
  },
  boolean: (filterValue) => ({
    equalTo: String(filterValue).toLowerCase() === 'true',
  }),
  equals: (filterValue) => ({ equalToInsensitive: filterValue }),
  // Use this if the values must conform to an Enum type (e.g. status, outcome)
  enumList: (filterValue, options) => ({
    in: splitCommaList(filterValue)
      .map((value) => value.toUpperCase().replace(' ', '_'))
      .filter((value) => (options?.enumList || []).includes(value)),
  }),
  // For string column of search and select values
  searchableListIn: (filterValue) => inList(filterValue),
  // For array column of search and select values
  searchableListInArray: (filterValue) => ({ overlaps: splitCommaList(filterValue) }),
  // For array column of static select values
  staticList: (filterValue) => inList(filterValue),
  // For string column of searchable values
  search: (filterValue) => ({ includesInsensitive: filterValue }),
  dataViewString: (filterValue, options) => {
    if (!options?.showFilterList) return { includesInsensitive: filterValue }
    if (!options?.delimiter) return inList(filterValue)

    const values = splitCommaList(filterValue)
    const complexOrFilter: any = { or: [] }
    options?.searchFields?.forEach((field) =>
      complexOrFilter.or.push(
        ...values.map((value) => ({ [field]: { includesInsensitive: value } }))
      )
    )
    return complexOrFilter
  },
  dataViewNumber: () => ({}),
  dataViewBoolean: (filterValue) => {
    return {
      equalTo: String(filterValue).toLowerCase() === 'true',
    }
  },
}

// Constructs OR filter i.e. { or: [fieldName1: filter, fieldName2: filter]}
const constructOrFilter = (filter: object, orFieldNames: string[]) => ({
  or: orFieldNames.map((fieldName) => ({
    [fieldName]: filter,
  })),
})

// Uses filterDefinition and filterTypeDefinitions to construct
const constructFilter = (
  { type, options }: FilterDefinition,
  filterName: string,
  filterValue: string
) => {
  const filter = filterTypeDefinitions[type](filterValue, options)

  // If all of the criteria is undefined skip filter
  // if (!Object.values(filter).find((value) => value !== undefined)) return {}

  // For dataViews' multiple matching lists
  if ('or' in filter) return filter

  const { orFieldNames = [], substituteColumnName = '' } = options || {}
  // If orFieldNames are provided return or statement

  if (orFieldNames.length > 0) return constructOrFilter(filter, orFieldNames)
  // If substituteColumnName is provided use substituteColumnName
  if (substituteColumnName) return { [substituteColumnName]: filter }

  // otherwise use filterName
  return { [filterName]: filter }
}

const splitCommaList = (values: string) => values.split(',')

// Use this if the values can be free text strings (e.g. stage name)
const inList = (values: string) => ({ inInsensitive: splitCommaList(values) })
