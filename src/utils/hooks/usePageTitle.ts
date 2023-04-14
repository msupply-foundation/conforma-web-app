import { useEffect, useState } from 'react'
import { useLanguageProvider } from '../../contexts/Localisation'

const usePageTitle = (title: string) => {
  const { t } = useLanguageProvider()
  const [pageTitle, setPageTitle] = useState(title)

  useEffect(() => {
    const newTitle = `${title} | ${t('_APP_NAME')}`
    setPageTitle(newTitle)
    document.title = newTitle
  }, [title])

  return { pageTitle, setPageTitle }
}

export default usePageTitle
