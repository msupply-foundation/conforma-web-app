import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => ({
  importModalProps,
  structure = null,
  ...props
}: any) => (
  <React.Fragment>
    <WrappedComponent structure={structure} {...props} />
    <ImportCsvModal
      open={importModalProps.open}
      onImportSuccess={importModalProps.onSuccess}
      onClose={importModalProps.onClose}
      structure={structure}
    />
  </React.Fragment>
)

export default withImportCsvModal
