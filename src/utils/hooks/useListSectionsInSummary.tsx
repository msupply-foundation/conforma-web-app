import { useEffect, useState } from 'react'

import useLoadElementsOfSection from './useLoadElementsOfSection'
import { SectionElements, SectionPagesElements, TemplateSectionPayload } from '../types'

interface useListSectionsInSummaryProps {
  serialNumber: string
  templateSections: TemplateSectionPayload[]
  isApplicationLoaded: boolean
}

const useListSectionsInSummary = ({
  serialNumber,
  templateSections,
  isApplicationLoaded,
}: useListSectionsInSummaryProps) => {
  const [applicationSections, setApplicationSections] = useState<SectionElements[]>()
  const [currentSection, setCurrentSection] = useState<number>(0)
  const [sectionsLoaded, setSectionsLoaded] = useState(false)
  const [processing, setProcessing] = useState<boolean>(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!templateSections || templateSections.length === 0) {
      setError('Unexpected missing sections')
      setProcessing(false)
    }
  }, [isApplicationLoaded])

  const { loading: loadingSection, error: errorSection, elements } = useLoadElementsOfSection({
    serialNumber,
    sectionTempId: templateSections[currentSection].id,
    isApplicationLoaded,
  })

  useEffect(() => {
    if (loadingSection) return
    if (errorSection || !elements) {
      setProcessing(false)
      errorSection
        ? setError(errorSection)
        : setError(`No elements in section ${templateSections[currentSection].title}`)
      return
    }
    const nextSectionIndex = currentSection + 1
    if (nextSectionIndex > templateSections.length) setSectionsLoaded(true)
    else {
      setApplicationSections(
        applicationSections
          ? [...applicationSections, getSectionElements(elements, currentSection, templateSections)]
          : [getSectionElements(elements, currentSection, templateSections)]
      )
      setCurrentSection(nextSectionIndex)
    }
  }, [loadingSection, elements])

  useEffect(() => {
    if (!sectionsLoaded) return

    setProcessing(false)
  }, [sectionsLoaded])

  return {
    applicationSections,
    error,
    processing,
  }
}

function getSectionElements(
  elements: SectionPagesElements,
  currentSection: number,
  templateSections: TemplateSectionPayload[]
): SectionElements {
  const { index, title } = templateSections[currentSection]
  return {
    index,
    title,
    pages: elements,
  }
}

export default useListSectionsInSummary
