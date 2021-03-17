import React from 'react'
import { ImportCsvModal } from '..'

const withImportCsvModal = (WrappedComponent: any) => (props: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <ImportCsvModal />
    </React.Fragment>
  )
}

export default withImportCsvModal
