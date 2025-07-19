import { Checkbox, Dropdown } from 'semantic-ui-react'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { useState } from 'react'
import useLoadApplication from '../../../utils/hooks/useLoadApplication'
import { useUserState } from '../../../contexts/UserState'
import { JsonEditor as ReactJson } from 'json-edit-react'
import useGetApplicationStructure from '../../../utils/hooks/useGetApplicationStructure'
import { FullStructure } from '../../../utils/types'

export const DataContainer = () => {
  const { preferences } = usePrefs()
  const [selectedApplication, setSelectedApplication] = useState<string>()
  const [backendData, setBackendData] = useState(false)

  const { structure, error, loading } = useLoadApplication({
    serialNumber: selectedApplication ?? '',
  })

  const applicationOptions = (preferences?.appDataTestApplications ?? []).map((serial) => ({
    key: serial,
    text: serial,
    value: serial,
  }))

  return (
    <div>
      <Dropdown
        value={selectedApplication}
        onChange={(_, { value }) => setSelectedApplication(value as string)}
        selection
        clearable
        placeholder="Select Application"
        options={applicationOptions}
      />
      <Checkbox
        label="Include backend data"
        checked={backendData}
        onChange={() => setBackendData(!backendData)}
        toggle
      />
      {selectedApplication &&
        structure &&
        (!backendData ? (
          <FrontEndAppDataDisplay structure={structure} />
        ) : (
          <BackEndAppDataDisplay applicationId={structure.info.id} />
        ))}
    </div>
  )
}

const FrontEndAppDataDisplay = ({ structure }: { structure: FullStructure }) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const { fullStructure } = useGetApplicationStructure({ structure })

  if (!fullStructure) return null

  const applicationData = {
    responses: {
      ...fullStructure?.responsesByCode,
      thisResponse: 'Current response',
    },
    currentUser,
    applicationData: { ...fullStructure?.info, currentPageType: 'application' },
  }
  return (
    <ReactJson
      rootFontSize={12}
      rootName="applicationData"
      data={applicationData}
      viewOnly
      collapse={1}
    />
  )
}

const BackEndAppDataDisplay = ({ applicationId }: { applicationId: number }) => {
  return <p>BACK END DATA FOR APPLICATION {applicationId}</p>
}
