import { gql } from '@apollo/client'
import { buildFieldList, capitalizeFirstLetter, toCamelCase } from '../utils'
import { plural } from 'pluralize'

const getDynamicSingleTable = (structure: any) => gql`
    query getDynamicSingleTable {
      dataTable${capitalizeFirstLetter(toCamelCase(plural(structure.tableName)))} {
        nodes {
          ${buildFieldList(structure.fieldMap)}
        }
      }
    }
  `

export default getDynamicSingleTable
