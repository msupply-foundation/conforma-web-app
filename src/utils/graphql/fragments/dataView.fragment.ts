import { gql } from '@apollo/client'

export default gql`
  fragment dataViewFragment on DataView {
    id
    identifier
    tableName
    title
    code
    permissionNames
    rowRestrictions
    tableViewIncludeColumns
    tableViewExcludeColumns
    tableSearchColumns
    detailViewIncludeColumns
    detailViewExcludeColumns
    detailViewHeaderColumn
    filterIncludeColumns
    filterExcludeColumns
    rawDataIncludeColumns
    rawDataExcludeColumns
    showLinkedApplications
    priority
    defaultSortColumn
    defaultFilterString
    menuName
    submenu
    enabled
  }
`
