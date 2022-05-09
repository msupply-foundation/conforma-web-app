import { gql } from '@apollo/client'
import { buildFieldList, capitalizeFirstLetter, toCamelCase } from '../utils'

const getDynamicSingleTable = (structure: any) => gql`
    query getDynamicSingleTable {
      dataTable${capitalizeFirstLetter(toCamelCase(structure.tableName))} {
        nodes {
          ${buildFieldList(structure.fieldMap)}
        }
      }
    }
  `

export default getDynamicSingleTable
