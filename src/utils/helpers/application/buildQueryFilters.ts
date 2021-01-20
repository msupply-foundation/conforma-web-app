export default function buildQueryFilters(filters: any) {
  const graphQLfilter = Object.entries(filters).reduce((filterObj, [key, value]) => {
    if (!mapQueryToFilterField?.[key]) return filterObj
    return { ...filterObj, ...mapQueryToFilterField[key](value) }
  }, {})
  return graphQLfilter
}

const mapQueryToFilterField: any = {
  type: (value: string) => {
    return {
      template: {
        code: { equalToInsensitive: value },
        status: { equalTo: 'AVAILABLE' },
      },
    }
  },
  // userRole -- doesn't affect filter
  // category -- not yet implemented in schema
  stage: (values: string) => {
    return {
      stage: inList(values),
    }
  },
  status: (values: string) => {
    return { status: inEnumList(values) }
  },
  outcome: (values: string) => {
    return { outcome: inEnumList(values) }
  },
  // (application) name,
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
  // search -- to do once sub-elements are made (applicant, )
  // lastActiveDate (needs better definition - Submitted?)
  // deadlineDate (TBD)
  // Done with seperate conditions:
  //    - page, per-page, sort-by
  // search
}

const splitCommaList = (values: string) => values.split(',')

// Use this if the values can be free text strings (e.g. stage name)
function inList(values: string) {
  return { inInsensitive: splitCommaList(values) }
}

// Use this if the values must conform to an Enum type (e.g. status name)
function inEnumList(values: string) {
  return { in: splitCommaList(values).map((value) => value.toUpperCase()) }
}
