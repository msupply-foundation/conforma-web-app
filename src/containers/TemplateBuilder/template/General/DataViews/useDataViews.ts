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
  const { template, dataViewJoins } = useTemplateState()
  const [dataViewDetails, setDataViewDetails] = useState<DataViewDetails[]>([])
  const [menuItems, setMenuItems] = useState<DataView[]>([])
  const [error, setError] = useState<string>('')

  const dataViews = (dataViewJoins.map((node) => ({
    ...node?.dataView,
    dataViewJoinId: node.id,
    suggested: dataViewDetails.find((d) => d.data.id === node?.dataView?.id)?.suggested ?? false,
  })) ?? []) as (DataView & { dataViewJoinId: number; suggested: boolean })[]

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
        setError('Error: ' + err.message)
      })
  }, [dataViewJoins])

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
