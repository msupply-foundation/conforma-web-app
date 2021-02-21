import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { FullStructure } from '../../utils/types'

interface ApplicationProps {
  structure: FullStructure
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure }) => {
  return <p>START PAGE</p>
}

export default ApplicationHome
