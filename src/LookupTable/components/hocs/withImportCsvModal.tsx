import React from 'react'
import { LookupTableImportCsvModal } from '..'

// withImportCsvModal
const withImportCsvModal = (WrappedComponent: any) => (props: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <LookupTableImportCsvModal />
    </React.Fragment>
  )
}

export default withImportCsvModal
