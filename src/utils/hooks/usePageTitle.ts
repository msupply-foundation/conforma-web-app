import { useEffect, useState } from 'react'
import strings from '../../utils/constants'

const usePageTitle = (title: string) => {
  const [pageTitle, setPageTitle] = useState(title)

  useEffect(() => {
    document.title = `${pageTitle} | ${strings.APP_NAME}`
  }, [pageTitle])

  return { pageTitle, setPageTitle }
}

export default usePageTitle
