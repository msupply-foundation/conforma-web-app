import React from 'react'
import { Loader, Segment } from 'semantic-ui-react'
import { useLanguageProvider } from '../contexts/Localisation'

const LoadingSmall: React.FC = () => {
  const { strings } = useLanguageProvider()
  return (
    <Segment basic style={{ height: '20vh' }}>
      <Loader active size="massive">
        {strings.LABEL_LOADING}
      </Loader>
    </Segment>
  )
}

export default LoadingSmall
