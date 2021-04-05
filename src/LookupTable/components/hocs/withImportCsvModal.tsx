import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({
  onImportSuccess,
  lookupTable = null,
  ...props
}: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal {...props} onImportSuccess={onImportSuccess} lookupTable={lookupTable} />
    </React.Fragment>
  )
}

export default withImportCsvModal
