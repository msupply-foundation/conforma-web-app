import React from 'react'
import { Loader, Segment } from 'semantic-ui-react'
import { useLanguageProvider } from '../contexts/Localisation'

const Loading: React.FC = () => {
  const { strings } = useLanguageProvider()
  return (
    <Segment basic style={{ height: '50vh' }}>
      <Loader active size="massive">
        {strings.LABEL_LOADING}
      </Loader>
    </Segment>
  )
}

export default Loading
