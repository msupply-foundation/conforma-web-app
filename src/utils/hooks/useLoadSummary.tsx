import { useState } from 'react'
import { SectionElements } from '../types'
import useLoadElements from './useLoadElements'

interface useLoadSummaryProps {
  applicationId: number
  sectionIds: number[]
}

const useLoadSummary = ({ applicationId, sectionIds }: useLoadSummaryProps) => {
  const [sectionElements, setSectionElements] = useState<SectionElements | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const totalSections = sectionIds.length
  sectionIds.forEach((section, index) => {
    useLoadElements({
      applicationId,
      sectionTempId: section,
      onCompletedHandler: (elements) => {
        setSectionElements({ ...sectionElements, [section]: elements })
        if (index + 1 === totalSections) setLoading(false)
      },
      onErrorHandler: (error) => {
        setLoading(false)
        setError(error.message)
      },
    })
  })

  return {
    loading,
    error,
    sectionElements,
  }
}

export default useLoadSummary
