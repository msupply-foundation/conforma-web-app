export default function buildSortFields(sortString: string) {
  console.log("DIdn't go here")
  const sortFields = sortString.split(',')
  return sortFields.map((field) => getGraphQLSortName(field))
}

const getGraphQLSortName = (field: string) => {
  const [fieldName, direction] = field.split(':')
  // TO-DO: Enforce fields names match Schema types and return blank if not.
  return `${fieldName.replace(/-/g, '_')}_${direction || 'ASC'}`.toUpperCase()
}
