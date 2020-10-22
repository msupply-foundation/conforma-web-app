import React from 'react'
import { useRouter } from '../utils/hooks/useRouter'

const Approval: React.FC = () => {
  const { query } = useRouter()
  const { serialNumber } = query
  return (
    <div>
      <h1>Application Approval page</h1>
      <p>Application number: {serialNumber}</p>
      <p>Only the Director can see this page.</p>
    </div>
  )
}

export default Approval
