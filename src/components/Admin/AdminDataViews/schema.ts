// Schema derived from the Typescript interface "DataView" below, by ChatGPT

export const DataViewSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'DataView',
  type: 'object',
  required: [
    'code',
    'detailViewHeaderColumn',
    'enabled',
    // 'id',
    'identifier',
    'showLinkedApplications',
    'tableName',
  ],
  properties: {
    code: { type: 'string' },
    defaultFilterString: { type: ['string', 'null'] },
    defaultSortColumn: { type: ['string', 'null'] },
    detailViewExcludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    detailViewHeaderColumn: { type: 'string' },
    detailViewIncludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    enabled: { type: 'boolean' },
    filterExcludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    filterIncludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    // id: { type: 'number' },
    identifier: { type: 'string' },
    menuName: { type: ['string', 'null'] },
    permissionNames: { type: ['array', 'null'], items: { type: 'string' } },
    priority: { type: ['number', 'null'] },
    rawDataExcludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    rawDataIncludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    rowRestrictions: { type: ['object', 'null'] },
    showLinkedApplications: { type: 'boolean' },
    submenu: { type: ['string', 'null'] },
    tableName: { type: 'string' },
    tableSearchColumns: { type: ['array', 'null'], items: { type: 'string' } },
    tableViewExcludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    tableViewIncludeColumns: { type: ['array', 'null'], items: { type: 'string' } },
    title: { type: ['string', 'null'] },
  },
  additionalProperties: false,
}

export const DataViewColumnDefinitionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'ColumnDefinition',
  type: 'object',
  required: [
    'columnName',
    // 'id'
  ],
  properties: {
    additionalFormatting: { type: ['object', 'null'] },
    columnName: { type: 'string' },
    elementParameters: { type: ['object', 'null'] },
    elementTypePluginCode: { type: ['string', 'null'] },
    filterDataType: { type: ['string', 'null'] },
    filterExpression: { type: ['object', 'null'] },
    filterParameters: { type: ['object', 'null'] },
    hideIfNull: { type: ['boolean', 'null'] },
    // id: { type: 'number' },
    sortColumn: { type: ['string', 'null'] },
    tableName: { type: ['string', 'null'] },
    title: { type: ['string', 'null'] },
    valueExpression: { type: ['object', 'null'] },
  },
  additionalProperties: false,
}

export interface DataView {
  code: string
  defaultFilterString: string | null
  defaultSortColumn: string | null
  detailViewExcludeColumns: string[] | null
  detailViewHeaderColumn: string
  detailViewIncludeColumns: string[] | null
  enabled: boolean
  filterExcludeColumns: string[] | null
  filterIncludeColumns: string[] | null
  id: number
  identifier: string
  menuName: string | null
  permissionNames: string[] | null
  priority: number | null
  rawDataExcludeColumns: string[] | null
  rawDataIncludeColumns: string[] | null
  rowRestrictions: object | null
  showLinkedApplications: boolean
  submenu: string | null
  tableName: string
  tableSearchColumns: string[] | null
  tableViewExcludeColumns: string[] | null
  tableViewIncludeColumns: string[] | null
  title: string | null
}

export interface DataViewColumnDefinition {
  additionalFormatting: object | null
  columnName: string
  elementParameters: object | null
  elementTypePluginCode: string | null
  filterDataType: string | null
  filterExpression: object | null
  filterParameters: object | null
  hideIfNull: boolean | null
  id: number
  sortColumn: string | null
  tableName: string | null
  title: string | null
  valueExpression: object | null
}
