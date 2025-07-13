import { useEffect, useState } from 'react'
import { getRequest } from '../../../../../utils/helpers/fetchMethods'
import getServerUrl from '../../../../../utils/helpers/endpoints/endpointUrlBuilder'
import { EvaluatorFragment } from '../../../../../utils/generated/graphql'
import { useTemplateState } from '../../TemplateWrapper'

interface FragmentsDetails {
  data: EvaluatorFragment
  applicantAccessible: boolean
  inTemplateElements: boolean
  inActions: boolean
}

export type FragmentFilter =
  | 'IN_ELEMENTS'
  | 'IN_ACTIONS'
  | 'SUGGESTED'
  | 'ALL'
  | 'APPLICANT_ACCESSIBLE'

export const useFragments = (filter: FragmentFilter) => {
  const { template, fragmentJoins } = useTemplateState()
  const [fragmentDetails, setFragmentDetails] = useState<FragmentsDetails[]>([])
  const [menuItems, setMenuItems] = useState<EvaluatorFragment[]>([])
  const [error, setError] = useState<string>('')

  const fragments = (fragmentJoins.map((node) => {
    const details = fragmentDetails.find((d) => d.data.id === node?.evaluatorFragment?.id)
    return {
      ...node?.evaluatorFragment,
      dataViewJoinId: node.id,
      inTemplateElements: details?.inTemplateElements ?? false,
      inActions: details?.inActions ?? false,
      applicantAccessible: details?.applicantAccessible ?? false,
    }
  }) ?? []) as (EvaluatorFragment & {
    dataViewJoinId: number
    inTemplateElements: boolean
    inActions: boolean
    applicantAccessible: boolean
  })[]

  const currentlyLinkedFragmentIDs = fragments.map(({ name }) => name)

  useEffect(() => {
    getRequest(
      getServerUrl('templateImportExport', {
        action: 'getFragmentDetails',
        id: template.id,
      })
    )
      .then((result) => {
        setFragmentDetails(result)
      })
      .catch((err) => {
        setError('Error: ' + err.message)
      })
  }, [fragmentJoins])

  useEffect(() => {
    setMenuItems(getFragmentMenuItems(fragmentDetails, currentlyLinkedFragmentIDs, filter))
  }, [filter, fragmentDetails])

  return {
    current: fragments,
    menuItems,
    error,
  }
}

const getFragmentMenuItems = (
  fragmentDetails: FragmentsDetails[],
  currentlyLinkedFragmentIDs: string[],
  filter: FragmentFilter
) => {
  let menuFragments: FragmentsDetails[] = []
  switch (filter) {
    case 'ALL':
      menuFragments = fragmentDetails
      break
    case 'IN_ELEMENTS':
      menuFragments = fragmentDetails.filter((dv) => dv.inTemplateElements)
      break
    case 'IN_ACTIONS':
      menuFragments = fragmentDetails.filter((dv) => dv.inActions)
      break
    case 'SUGGESTED':
      menuFragments = fragmentDetails.filter((dv) => dv.inTemplateElements || dv.inActions)
      break
    case 'APPLICANT_ACCESSIBLE':
      menuFragments = fragmentDetails.filter((dv) => dv.applicantAccessible)
      break
  }

  return menuFragments
    .filter((frag) => !currentlyLinkedFragmentIDs.includes(frag.data.name))
    .map((frag) => frag.data)
}
