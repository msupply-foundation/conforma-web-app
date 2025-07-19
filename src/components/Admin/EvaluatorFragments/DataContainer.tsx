import { Checkbox, Dropdown } from 'semantic-ui-react'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { useEffect, useState } from 'react'
import useLoadApplication from '../../../utils/hooks/useLoadApplication'
import { useUserState } from '../../../contexts/UserState'
import { JsonEditor as ReactJson } from 'json-edit-react'
import useGetApplicationStructure from '../../../utils/hooks/useGetApplicationStructure'
import { FullStructure } from '../../../utils/types'
import { getRequest } from '../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { FigTreeEvaluator } from 'fig-tree-editor-react'

export const DataContainer = ({ figTree }: { figTree: FigTreeEvaluator }) => {
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
    <div className="flex-column" style={{ gap: '0.5em', paddingLeft: '1em', maxWidth: 400 }}>
      <Dropdown
        value={selectedApplication}
        onChange={(_, { value }) => setSelectedApplication(value as string)}
        selection
        clearable
        placeholder="Select test application"
        options={applicationOptions}
        style={{ width: 'fit-content', fontSize: '80%', zIndex: 100 }}
      />
      <Checkbox
        label="Use backend (Action) data"
        checked={backendData}
        onChange={() => setBackendData(!backendData)}
        toggle
        style={{ fontSize: '90%' }}
      />
      {selectedApplication &&
        structure &&
        (!backendData ? (
          <FrontEndAppDataDisplay structure={structure} figTree={figTree} />
        ) : (
          <BackEndAppDataDisplay applicationId={structure.info.id} figTree={figTree} />
        ))}
    </div>
  )
}

interface FrontEndAppDataDisplayProps {
  structure: FullStructure
  figTree: FigTreeEvaluator
}

const FrontEndAppDataDisplay = ({ structure, figTree }: FrontEndAppDataDisplayProps) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const [applicationData, setApplicationData] = useState<Record<string, unknown>>({})

  const { fullStructure } = useGetApplicationStructure({ structure })

  useEffect(() => {
    const applicationData = {
      responses: {
        ...fullStructure?.responsesByCode,
        thisResponse: 'Current response',
      },
      currentUser,
      applicationData: { ...fullStructure?.info, currentPageType: 'application' },
    }
    figTree.updateOptions({ data: applicationData })
    setApplicationData(applicationData)
  }, [fullStructure])

  if (!fullStructure) return null

  return (
    <ReactJson
      rootFontSize={12}
      rootName=""
      data={applicationData}
      viewOnly
      collapse={1}
      theme={{ container: { backgroundColor: 'transparent' } }}
    />
  )
}

interface BackEndAppDataDisplayProps {
  applicationId: number
  figTree: FigTreeEvaluator
}

const BackEndAppDataDisplay = ({ applicationId, figTree }: BackEndAppDataDisplayProps) => {
  const [applicationData, setApplicationData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    getRequest(getServerUrl('getApplicationData', { applicationId })).then((applicationData) => {
      setApplicationData(applicationData)
      figTree.updateOptions({ data: { applicationData } })
    })
  }, [applicationId, figTree])
  return (
    <ReactJson
      rootFontSize={12}
      rootName=""
      data={applicationData}
      viewOnly
      collapse={1}
      theme={{ container: { backgroundColor: 'transparent' } }}
    />
  )
}
