import { useEffect, useState } from 'react'
import { buildSectionsStructure } from '../helpers/application/buildSectionsStructure'
import validatePage, {
  getCombinedStatus,
  PROGRESS_STATUS,
} from '../helpers/application/validatePage'
import {
  ApplicationElementStates,
  ProgressInApplication,
  ProgressStatus,
  ResponsesByCode,
  SectionDetails,
  SectionsStructure,
  UseGetApplicationProps,
  ValidationMode,
} from '../types'
import useGetResponsesAndElementState from './useGetResponsesAndElementState'
import useLoadApplication from './useLoadApplication'

const useLoadSectionsStructure = ({
  serialNumber,
  currentUser,
  sectionCode,
  networkFetch,
  setApplicationState,
  page,
}: UseGetApplicationProps) => {
  const [sectionsStructure, setSectionsStructure] = useState<SectionsStructure>()
  const [currentSection, setCurrentSection] = useState<SectionDetails>()
  const [progressInApplication, setProgressInApplication] = useState<ProgressInApplication>()

  const {
    error: applicationError,
    loading: applicationLoading,
    application,
    template,
    sections,
    isApplicationReady,
  } = useLoadApplication({
    serialNumber,
    currentUser,
    networkFetch,
  })

  const {
    error: responsesError,
    loading: responsesLoading,
    responsesByCode,
    elementsState,
  } = useGetResponsesAndElementState({
    serialNumber,
    currentUser,
    isApplicationReady,
  })

  // Buld SectionStructure to display each section (Application/Review)
  // separated by pages with elements, responses, review and progress
  useEffect(() => {
    if (!responsesLoading && elementsState && responsesByCode) {
      const sectionsStructure = buildSectionsStructure({
        sections,
        elementsState,
        responsesByCode,
      })
      setSectionsStructure(sectionsStructure)
    }
  }, [elementsState, responsesLoading])

  // After building the structure set the current section/page
  useEffect(() => {
    if (!sectionsStructure) return

    const foundSection = sections.find(({ code }) => code === sectionCode)
    if (foundSection) setCurrentSection(foundSection)
    else {
      const firstSection = sectionsStructure[Object.keys(sectionsStructure)[0]]
      setCurrentSection(firstSection.details)
    }
  }, [sectionsStructure])

  // ------------ Temporary code: Getting current structure to display progress per page
  useEffect(() => {
    if (!currentSection) return
    const progressStructure = buildProgressInApplication({
      elementsState,
      responses: responsesByCode,
      sections: sections,
      isLinear: application?.isLinear as boolean,
      currentSection: currentSection?.index,
      currentPage: Number(page),
    })
    setProgressInApplication(progressStructure)
  }, [currentSection])
  // ----------- End of Temporary

  // Update timestamp to keep track of when elements have been properly updated
  // after losing focus.
  useEffect(() => {
    if (setApplicationState)
      setApplicationState({
        type: 'setElementTimestamp',
        timestampType: 'elementsStateUpdatedTimestamp',
      })
  }, [elementsState])

  return {
    error: applicationError || responsesError,
    loading: applicationLoading || responsesLoading,
    template,
    application,
    allResponses: responsesByCode,
    sectionsStructure,
    currentSection,
    isApplicationReady,
    progressInApplication, // To be deleted
  }
}

export default useLoadSectionsStructure

// --------- Temporary code: to be replace with SectionStructure and SectionProgress
interface buildProgressInApplicationProps {
  elementsState: ApplicationElementStates | undefined
  responses: ResponsesByCode | undefined
  sections: SectionDetails[]
  isLinear: boolean
  currentSection: number
  currentPage: number
  validationMode?: ValidationMode
}

function buildProgressInApplication({
  elementsState,
  responses,
  sections,
  isLinear,
  currentSection,
  currentPage,
  validationMode = 'LOOSE',
}: buildProgressInApplicationProps): ProgressInApplication {
  if (!elementsState || !responses) return []

  let previousSectionStatus: ProgressStatus = PROGRESS_STATUS.VALID
  let previousPageStatus: ProgressStatus = PROGRESS_STATUS.VALID

  const isCurrentPage = (page: number, sectionIndex: number) =>
    sectionIndex === currentSection && page === currentPage
  const isCurrentSection = (sectionIndex: number) => sectionIndex === currentSection

  const isPreviousPageValid = (pageNumber: number, sectionIndex: number): boolean => {
    if (pageNumber === 1 && sectionIndex === 0) return true // First page in first section can be navigated always
    const previousPage = pageNumber - 1
    const isPreviousActive =
      previousPage > 0
        ? isCurrentPage(previousPage, sectionIndex)
        : isCurrentSection(sectionIndex - 1)
    return isPreviousActive ? false : previousPageStatus === PROGRESS_STATUS.VALID
  }

  const getPageStatus = (sectionIndex: number, page: number, validationMode: ValidationMode) => {
    const draftPageStatus = validatePage({
      elementsState,
      responses,
      currentSectionIndex: sectionIndex,
      page,
    })
    if (validationMode === 'STRICT')
      return draftPageStatus === PROGRESS_STATUS.VALID
        ? PROGRESS_STATUS.VALID
        : PROGRESS_STATUS.NOT_VALID
    return draftPageStatus
  }

  const getPageValidationMode = (pageNumber: number, sectionIndex: number) =>
    isLinear && isPreviousPageValid(pageNumber, sectionIndex) ? 'STRICT' : 'LOOSE'

  return sections.map((section) => {
    // Create an array with all pages in each section
    const pageNumbers = Array.from(Array(section.totalPages).keys(), (n) => n + 1)

    const isPreviousSectionValid = previousSectionStatus === PROGRESS_STATUS.VALID
    previousPageStatus = previousSectionStatus

    // Run each page using strict validation mode for linear application with visited pages
    const pages = pageNumbers.map((pageNumber) => {
      const pageValidationMode = validationMode || getPageValidationMode(pageNumber, section.index)

      const status = getPageStatus(section.index, pageNumber, pageValidationMode)
      previousPageStatus = status // Update new previous page for next iteration

      return {
        pageNumber,
        canNavigate: isLinear ? isPreviousPageValid(pageNumber, section.index) : true,
        isActive: isCurrentPage(pageNumber, section.index),
        status,
      }
    })

    const progressInSection = {
      code: section.code,
      title: section.title,
      canNavigate: !isLinear || section.index <= currentSection || isPreviousSectionValid,
      isActive: section.index === currentSection,
      status: getCombinedStatus(pages.map(({ status }) => status)),
      pages,
    }

    previousSectionStatus = progressInSection.status

    return progressInSection
  })
}

//--------- End of temporary code
