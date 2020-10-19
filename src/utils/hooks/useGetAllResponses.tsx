import { useState, useEffect } from 'react'
import {
    Application,
    ApplicationSection,
    useGetApplicationQuery,
  } from '../generated/graphql'
import { Response, AllResponses} from '../types'

interface useLoadApplicationProps {
    serialNumber: number
}

const useGetAllResponses = (props: useLoadApplicationProps) => {
    const { serialNumber } = props
    const [allResponses, setAllResponses] = useState({})
    const { data, loading, error} = useGetApplicationQuery({
        variables: {
          serial: serialNumber
        }
      })


  useEffect(()=> {
    if (data?.applications) {
        if (data.applications.nodes.length === 0) return
      if (data.applications.nodes.length > 1)
        console.log('More than one application returned. Only one expected!')
        
      const applicationResponses = data.applications.nodes[0]?.applicationResponses.nodes
      
      const currentResponses = {} as AllResponses

      applicationResponses?.forEach((response) => {
        const code = response?.templateElement?.code
        if (code) currentResponses[code] = response?.value
      })

      setAllResponses(currentResponses)
    }
  }, [data, error])

  return {
      error,
      loading,
      allResponses
  }
}

export default useGetAllResponses