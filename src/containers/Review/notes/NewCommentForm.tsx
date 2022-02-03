import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Container, Dropdown, Icon, Image, Form } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { ApplicationNote, useGetApplicationNotesQuery } from '../../../utils/generated/graphql'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { DateTime } from 'luxon'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'
import config from '../../../config'

const downloadUrl = `${config.serverREST}/public`

const NewCommentForm: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  return (
    <Form id="new-comment-form">
      <Form.TextArea
        label="Enter comment (Markdown formatting is supported)"
        placeholder="Tell us more about you..."
      />
      <Button type="submit" primary className="wide-button" onClick={() => {}}>
        Submit
      </Button>
    </Form>
  )
}

export default NewCommentForm
