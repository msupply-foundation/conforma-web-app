import React, { useState, useEffect } from 'react'
import { Container, List, Header, Image } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useGetApplicationDocsQuery } from '../../../utils/generated/graphql'
import { useUserState } from '../../../contexts/UserState'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import config from '../../../config'

const downloadUrl = `${config.serverREST}/public`

const DocumentsTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()
  const {
    userState: { currentUser },
  } = useUserState()

  const { data, loading, error } = useGetApplicationDocsQuery({
    variables: { applicationSerial: fullStructure.info.serial },
    // fetchPolicy: 'network-only',
  })

  if (error) return <p>{error.message}</p>
  if (loading) return <Loading />

  const docs = data?.files?.nodes

  return docs ? (
    <Container id="documents-tab">
      <Header as="h3" className="center-text">
        {strings.REVIEW_DOC_HEADER}
      </Header>
      <List id="document-list">
        {docs.map((doc) => (
          <List.Item>
            <div className="flex-row-start flex-extra">
              <div className="icon-container">
                <a href={`${downloadUrl}/file?uid=${doc?.uniqueId}`} target="_blank">
                  <Image src={`${downloadUrl}/file?uid=${doc?.uniqueId}&thumbnail=true`} />
                </a>
              </div>
              <div>
                <p>{doc?.description}</p>
                <p className="smaller-text">
                  <a href={`${downloadUrl}/file?uid=${doc?.uniqueId}`} target="_blank">
                    {doc?.originalFilename}
                  </a>
                </p>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
    </Container>
  ) : null
}

export default DocumentsTab
