import { useEffect, useState } from 'react'
import strings from '../../utils/constants'

const usePageTitle = (title: string) => {
  const [pageTitle, setPageTitle] = useState(title)

  useEffect(() => {
    const newTitle = `${title} | ${strings.APP_NAME}`
    setPageTitle(newTitle)
    document.title = newTitle
  }, [title])

  return { pageTitle, setPageTitle }
}

export default usePageTitle
