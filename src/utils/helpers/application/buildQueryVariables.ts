export default function buildSortFields(sortString: string) {
  const sortFields = sortString.split(',')
  return sortFields.map((field) => getGraphQLSortName(field))
}

const getGraphQLSortName = (field: string) => {
  const [fieldName, direction] = field.split(':')
  // TO-DO: Enforce fields names match Schema types and return blank if not.
  // Will add this once we do #185 -- make Applications View table
  return `${fieldName.replace(/-/g, '_')}_${direction || 'ASC'}`.toUpperCase()
}

type PaginationValues = {
  numberToFetch: number
  paginationOffset: number
}

export function getPaginationVariables(page: number, perPage = 20): PaginationValues {
  return { numberToFetch: perPage, paginationOffset: (page - 1) * perPage }
}
