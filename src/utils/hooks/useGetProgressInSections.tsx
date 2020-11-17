import { useEffect, useState } from 'react'
import useLoadElementsOfSection from './useLoadElementsOfSection'
import { ApplicationDetails, TemplateSectionPayload } from '../types'

interface getProgressInSectionProps {
  application: ApplicationDetails | undefined
  currentSection: TemplateSectionPayload | undefined
  currentPage: number
  elementsState: any
  templateSections: TemplateSectionPayload[]
}

interface PageProgress {
  pageStatus?: boolean | undefined
  visited: boolean
}

interface SectionProgress {
  sectionStatus?: boolean | undefined
  visited: boolean
  pages: {
    [page: number]: PageProgress
  }
}

interface ApplicationProgress {
  [section: string]: SectionProgress
}

interface CheckingSectionAndPage {
  section: TemplateSectionPayload
  page: number
}

const getProgressInSections = ({
  application,
  currentSection,
  currentPage,
  elementsState,
  templateSections,
}: getProgressInSectionProps) => {
  const [processing, setProcessing] = useState(true)
  const [checkingSectionAndPage, setCheckingSectionAndPage] = useState<
    CheckingSectionAndPage | undefined
  >(templateSections.length > 0 ? { section: templateSections[0], page: 1 } : undefined)
  const [progressInSections, setProgressInSection] = useState<ApplicationProgress>(
    sectionsInitialState(templateSections)
  )

  const { elements, loading, error } = useLoadElementsOfSection({
    applicationId: application ? application.id : undefined,
    sectionTempId: checkingSectionAndPage ? checkingSectionAndPage.section.id : 0,
    sectionPage: checkingSectionAndPage ? checkingSectionAndPage.page : 0,
  })

  useEffect(() => {
    console.log('useGetProgressInSections', application, currentSection)
  }, [application, currentSection])

  useEffect(() => {
    // if (!currentSection || !checkingSectionAndPage) setProcessing(false)

    if (checkingSectionAndPage) {
      console.log('progressInSections', progressInSections)

      // Only checks for sections/pages visited
      if (
        currentSection === checkingSectionAndPage?.section &&
        currentPage === checkingSectionAndPage?.page
      ) {
        setProcessing(false)
        console.log('Reach end')
      }

      const section = checkingSectionAndPage?.section.code as string
      const page = checkingSectionAndPage?.page as number
      // Process validation in page
      setProgressInSection({
        ...progressInSections,
        [section]: {
          ...progressInSections[section],
          pages: {
            ...progressInSections[section].pages,
            [page]: { pageStatus: true, visited: true }, // TODO: Update pageStatus
          },
        },
      })

      // Move to the next page/section
      const previousSectionAndPage = checkingSectionAndPage as CheckingSectionAndPage
      if (previousSectionAndPage.page > previousSectionAndPage.section.totalPages) {
        const nextIndex = previousSectionAndPage.section.index + 1
        const nextSection = templateSections.find(({ index }) => index === nextIndex)
        if (!nextSection) setProcessing(false)
        else setCheckingSectionAndPage({ section: nextSection, page: 1 }) // TODO: Not hardcoded
      } else {
        setCheckingSectionAndPage({
          ...previousSectionAndPage,
          page: previousSectionAndPage.page + 1,
        })
      }
    }
  }, [checkingSectionAndPage])

  return {
    processing,
    progressInSections,
  }
}

const sectionsInitialState = (templateSections: TemplateSectionPayload[]): ApplicationProgress => {
  return templateSections.reduce((objSections, section) => {
    const pages = Array.from(Array(section.totalPages).keys(), (n) => n + 1)
    const pagesProgress = pages.reduce((objPages, page) => {
      return {
        ...objPages,
        [page]: {
          visited: false,
        },
      }
    }, {})
    return {
      ...objSections,
      [section.code]: {
        visited: false,
        pages: pagesProgress,
      },
    }
  }, {})
}

export default getProgressInSections
