import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({ getTableStructures, ...props }: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal {...props} onSucessfulImport={getTableStructures} />
    </React.Fragment>
  )
}

export default withImportCsvModal
