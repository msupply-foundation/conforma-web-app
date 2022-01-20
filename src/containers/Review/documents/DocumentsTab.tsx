import React, { useState, useEffect } from 'react'
import { Container, Message } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'

const DocumentsTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  return (
    <Container id="documents-tab">
      <Message>
        <Message.Header>Placeholder for DOCUMENTS tab</Message.Header>
      </Message>
    </Container>
  )
}

export default DocumentsTab
