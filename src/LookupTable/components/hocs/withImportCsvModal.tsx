import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({ onImportSuccess, ...props }: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal {...props} onImportSuccess={onImportSuccess} />
    </React.Fragment>
  )
}

export default withImportCsvModal
