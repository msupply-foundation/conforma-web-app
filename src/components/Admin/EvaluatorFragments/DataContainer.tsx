import { Dropdown } from 'semantic-ui-react'
import { usePrefs } from '../../../contexts/SystemPrefs'

export const DataContainer = () => {
  const { preferences } = usePrefs()

  const applicationOptions = (preferences?.appDataTestApplications ?? []).map((serial) => ({
    key: serial,
    text: serial,
    value: serial,
  }))

  return (
    <div>
      <Dropdown options={applicationOptions} />
    </div>
  )
}
