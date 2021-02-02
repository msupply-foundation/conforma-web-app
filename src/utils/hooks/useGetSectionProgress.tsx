import { useState, useEffect } from 'react'
import { revalidateAll } from '../helpers/application/revalidateAll'
import {
  ApplicationElementStates,
  ResponsesByCode,
  SectionsProgress,
  TemplateSectionPayload,
  User,
} from '../types'

interface UseGetSectionProgressProps {
  loadStart: boolean
  currentUser: User | undefined
  templateSections: TemplateSectionPayload[] | undefined
  elementsState: ApplicationElementStates | undefined
  responsesByCode: ResponsesByCode | undefined
}

const useGetSectionsProgress = ({
  loadStart,
  currentUser,
  templateSections,
  elementsState,
  responsesByCode,
}: UseGetSectionProgressProps) => {
  const [sections, setSections] = useState<SectionsProgress>()

  useEffect(() => {
    if (loadStart && currentUser && elementsState && responsesByCode) {
      runValidation(currentUser, elementsState, responsesByCode)
    }
  }, [loadStart])

  return {
    sections,
  }
}

export default useGetSectionsProgress

async function runValidation(
  currentUser: User,
  elementsState: ApplicationElementStates,
  responsesByCode: ResponsesByCode
) {
  console.log('Will revalidate...')

  const revalidate = await revalidateAll(elementsState, responsesByCode, currentUser)

  console.log('revalidate result', revalidate)

  return revalidate

  //   if (revalidate.validityFailures.length > 0) {
  //     const { firstErrorSectionCode, firstErrorPage } = getFirstErrorLocation(
  //       revalidate.validityFailures,
  //       elementsState as ApplicationElementStates
  //     )
  //     push(`/application/${serialNumber}/${firstErrorSectionCode}/Page${firstErrorPage}`)
  //   } else {
  //     const firstSection = templateSections[0].code
  //     replace(`/application/${serialNumber}/${firstSection}/Page1`)
  //   }
}
