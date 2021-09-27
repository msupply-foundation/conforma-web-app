import { useEffect, useState } from 'react'
import { getRequest } from '../helpers/fetchMethods'

// for production we get URL relative to web app
const { port, hostname, protocol } = window.location
const getUrl = (path: string) => `${protocol}//${hostname}:${port}/${path}`
const isProductionBuild = process.env.NODE_ENV === 'production'

const useConfig = () => {
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const processConfig = (fetchedConfig: any) => {
    const config = fetchedConfig.web
    config.serverGraphQL = isProductionBuild
      ? getUrl('postgraphile/graphql')
      : fetchedConfig.web.serverGraphQL
    setConfig(config)
    setLoading(false)
  }

  useEffect(() => {
    getRequest('http://localhost:8080/get-config')
      .then((result) => {
        processConfig(result)
      })
      .catch((err) => {
        setLoading(false)
        setError(err)
      })
  }, [])

  return { config, loading, error }
}

export default useConfig
