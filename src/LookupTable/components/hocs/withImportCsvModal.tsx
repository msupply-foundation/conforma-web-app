import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({
  onImportSuccess,
  structure = null,
  ...props
}: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal {...props} onImportSuccess={onImportSuccess} structure={structure} />
    </React.Fragment>
  )
}

export default withImportCsvModal
