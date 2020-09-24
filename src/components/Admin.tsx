import React from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

const Admin: React.FC = () => {
  return (
    <div>
      <h1>Admin area</h1>
      <p>Only Admins can see this page.</p>
    </div>
  )
}

export default Admin
