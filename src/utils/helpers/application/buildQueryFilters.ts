export default function buildQueryFilters(filters: any) {
  //   console.log('filters', filters)

  const keyValuePairs = Object.entries(filters)
    .map(([key, value]) => {
      if (!mapQueryToFilterField?.[key]) return // filter field not recognised
      const { fieldName, valueFunction } = mapQueryToFilterField[key]
      return [fieldName, valueFunction(value)]
    })
    .filter((entry) => entry) // remove undefined
  return Object.fromEntries(keyValuePairs as string[][])
}

const mapQueryToFilterField: any = {
  type: {
    fieldName: 'template',
    valueFunction: (value: string) => {
      return {
        code: { equalToInsensitive: value },
        status: { equalTo: 'AVAILABLE' },
      }
    },
  },
  // userRole -- how do we query by it?
  // category -- not yet implemented in schema
  stage: {
    fieldName: 'stage',
    valueFunction: inList,
  },
  status: {
    fieldName: 'status',
    valueFunction: inEnumList,
  },
  // NOT sort-by (done seperate)
  outcome: {
    fieldName: 'outcome',
    valueFunction: inEnumList,
  },
  // action
  // assigned
  // consolidator
  // applicant
  // org
  // search
  // lastActiveDate (needs better definition - Submitted?)
  // deadlineDate (TBD)
  // Done with seperate conditions:
  //    - page, per-page, sort-by
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
