import React, { useEffect } from 'react'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useUserState } from '../../contexts/UserState'
import useLoadTemplate from '../../utils/hooks/useLoadTemplateNEW'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationCreateNEW: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { serialNumber } = applicationState
  const { push, query } = useRouter()
  const { type } = query

  const { error, loading, template, sectionsStructure, elementsIds } = useLoadTemplate({
    templateCode: type as string,
  })

  const {
    userState: { currentUser },
  } = useUserState()

  useEffect(() => {
    if (sectionsStructure) console.log(sectionsStructure)
  }, [sectionsStructure])

  return <p>APPLICATION CREATE</p>
}

export default ApplicationCreateNEW
