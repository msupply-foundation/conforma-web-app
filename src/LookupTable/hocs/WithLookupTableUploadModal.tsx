import React from 'react'
import { LookupTableUploadModal } from '../components'

const WithLookupTableUploadModal = (WrappedComponent: any) => (props: any) => {
  return (
    <React.Fragment>
      <WrappedComponent {...props} />
      <LookupTableUploadModal />
    </React.Fragment>
  )
}

export default WithLookupTableUploadModal
