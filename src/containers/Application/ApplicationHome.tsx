import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { FullStructure } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'

interface ApplicationProps {
  structure: FullStructure
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure }) => {
  const { error, isLoading, fullStructure, responsesByCode } = useGetFullApplicationStructure(
    structure
  )

  return <p>START PAGE</p>
}

// const

export default ApplicationHome
