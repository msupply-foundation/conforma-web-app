import React, { useState, useEffect } from 'react'
import { Container, Message } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { FullStructure } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'

const ReviewProgress: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  return (
    <div id="review-progress">
      <Message size="huge">
        <Message.Header>Placeholder for PROGRESS BAR</Message.Header>
      </Message>
    </div>
  )
}

export default ReviewProgress
