import { useState, useEffect } from 'react'
import { FullStructure } from '../types'
import {
  Application,
  ApplicationSection,
  Template,
  TemplateElement,
  TemplateStage,
  useGetAllResponsesQuery,
} from '../generated/graphql'

const useGetFullApplicationStructure = (structure: FullStructure) => {
  const serial = '12345'
  const networkFetch = true
  const { data, error, loading, refetchQueries } = useGetAllResponsesQuery({
    variables: {
      serial,
    },
    fetchPolicy: networkFetch ? 'network-only' : 'cache-first',
  })
  return { fullStructure: 'Just for now', error: false, isLoading: false, responsesByCode: 'Temp' }
}

export default useGetFullApplicationStructure
