import React from 'react'
import { ImportCsvModal } from '..'
import { TableStructuresContext } from '../../contexts/TableStructuresContext'

const withImportCsvModal = (WrappedComponent: any) => (props: any) => {
  const { getTableStructures } = React.useContext(TableStructuresContext)
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal {...props} getTableStructures={() => getTableStructures()} />
    </React.Fragment>
  )
}

export default withImportCsvModal
