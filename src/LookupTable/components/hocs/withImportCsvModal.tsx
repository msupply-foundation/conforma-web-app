import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({
  onImportSuccess,
  structure = null,
  importModelOpen = false,
  ...props
}: any) => {
  console.log('importModelOpen in hoc', importModelOpen)
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal
        {...props}
        importModelOpen={importModelOpen}
        onImportSuccess={onImportSuccess}
        structure={structure}
      />
    </React.Fragment>
  )
}

export default withImportCsvModal
