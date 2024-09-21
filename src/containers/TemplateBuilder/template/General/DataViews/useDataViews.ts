import { useEffect, useState } from 'react'
import { getRequest } from '../../../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { DataView } from '../../../../../utils/generated/graphql'
import { useTemplateState } from '../../TemplateWrapper'

interface DataViewDetails {
  data: DataView
  applicantAccessible: boolean
  suggested: boolean
}

export type DataViewFilter = 'SUGGESTED' | 'ALL' | 'APPLICANT_ACCESSIBLE'

export const useDataViews = (filter: DataViewFilter) => {
  const { template, dataViews } = useTemplateState()
  const [dataViewDetails, setDataViewDetails] = useState<DataViewDetails[]>([])
  const [menuItems, setMenuItems] = useState<DataView[]>([])
  const [error, setError] = useState<string>('')
  useEffect(() => {
    getRequest(
      getServerUrl('templateImportExport', {
        action: 'getDataViews',
        id: template.id,
      })
    )
      .then((result) => {
        setDataViewDetails(result)
      })
      .catch((err) => {
        // To-DO
      })
  }, [])

  useEffect(() => {
    setMenuItems(getDataViewMenuItems(dataViewDetails, dataViews, filter))
  }, [filter, dataViewDetails])

  return {
    current: dataViews,
    menuItems,
    error,
  }
}

const getDataViewMenuItems = (
  dataViewDetails: DataViewDetails[],
  dataViews: DataView[],
  filter: DataViewFilter
) => {
  let menuDataViews: DataViewDetails[] = []
  switch (filter) {
    case 'ALL':
      menuDataViews = dataViewDetails
      break
    case 'SUGGESTED':
      menuDataViews = dataViewDetails.filter((dv) => dv.suggested)
      break
    case 'APPLICANT_ACCESSIBLE':
      menuDataViews = dataViewDetails.filter((dv) => dv.applicantAccessible)
      break
  }
  const currentlyLinkedDataViewIDs = dataViews.map(({ identifier }) => identifier)

  return menuDataViews
    .filter((dv) => !currentlyLinkedDataViewIDs.includes(dv.data.identifier))
    .map((dv) => dv.data)
}
