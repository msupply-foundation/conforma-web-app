import React from 'react'
import { Container, List, Header, Image } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { useGetApplicationDocsQuery } from '../../../utils/generated/graphql'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { DateTime } from 'luxon'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'

const DocumentsTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { strings } = useLanguageProvider()

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
      <div className="flex-column-center-start"></div>
      <List id="document-list" className="flex-row-space_evenly flex-extra">
        {docs.map((doc) => (
          <List.Item
            className="clickable"
            onClick={() => window.open(getServerUrl('file', { fileId: doc!.uniqueId }), '_blank')}
          >
            <div className="flex-row-start flex-extra">
              <div className="icon-container">
                <Image src={getServerUrl('file', { fileId: doc!.uniqueId, thumbnail: true })} />
              </div>
              <div>
                <Header as="h4" content={doc?.description} />
                <p className="slightly-smaller-text">
                  {DateTime.fromISO(doc?.timestamp).toLocaleString()}
                </p>
                <p className="smaller-text">
                  <a href={getServerUrl('file', { fileId: doc!.uniqueId })} target="_blank">
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
