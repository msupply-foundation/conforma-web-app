import { gql } from '@apollo/client'
import React from 'react'
import { capitalizeFirstLetter, toCamelCase, buildFieldList } from '../utils'

const TABLE_NAME_PREFIX = 'lookupTable'

const WithLookUpTableStructure = (WrappedComponent: any) => (props: any) => {
  const { name: tableName, fieldMap } = props.structure

  const query = gql`
    {
      lookupTable${capitalizeFirstLetter(toCamelCase(tableName))}s {
        nodes {
          ${buildFieldList(fieldMap)}
        }
      }
    }
  `

  return (
    <WrappedComponent
      tableQuery={query}
      tableName={`${TABLE_NAME_PREFIX}${capitalizeFirstLetter(toCamelCase(tableName))}s`}
      {...props}
    />
  )
}

export default WithLookUpTableStructure
