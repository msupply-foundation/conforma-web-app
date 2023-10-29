import React, { useState } from 'react'
import { Container, List, Header, Image } from 'semantic-ui-react'
import Loading from '../../../components/Loading'
import { File, useGetApplicationDocsQuery } from '../../../utils/generated/graphql'
import { FullStructure } from '../../../utils/types'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { DateTime } from 'luxon'
import { usePrefs } from '../../../contexts/SystemPrefs'
import getServerUrl from '../../../utils/helpers/endpoints/endpointUrlBuilder'
import { DocumentModal, handleFile } from '../../../components/common/DocumentModal/DocumentModal'

const DocumentsTab: React.FC<{
  structure: FullStructure
}> = ({ structure: fullStructure }) => {
  const { t } = useLanguageProvider()
  const {
    preferences: { useDocumentModal },
  } = usePrefs()
  const [openFile, setOpenFile] = useState<number>()

  const { data, loading, error } = useGetApplicationDocsQuery({
    variables: { applicationSerial: fullStructure.info.serial },
    // fetchPolicy: 'network-only',
  })

  if (error) return <p>{error.message}</p>
  if (loading) return <Loading />

  const docs = data?.files?.nodes as File[]

  return docs ? (
    <Container id="documents-tab">
      <Header as="h3" className="center-text">
        {t('REVIEW_DOC_HEADER')}
      </Header>
      <div className="flex-column-center-start"></div>
      <List id="document-list" className="flex-row-space_evenly flex-extra">
        {docs.map((doc, index) => {
          const { uniqueId, description, originalFilename, timestamp } = doc
          const fileUrl = getServerUrl('file', { fileId: uniqueId })
          const thumbnailUrl = getServerUrl('file', { fileId: uniqueId, thumbnail: true })
          const docOpen = () =>
            handleFile(useDocumentModal, originalFilename, fileUrl, () => setOpenFile(index))

          return (
            <>
              {useDocumentModal && (
                <DocumentModal
                  url={fileUrl}
                  filename={originalFilename}
                  open={index === openFile}
                  onClose={() => setOpenFile(undefined)}
                />
              )}
              <List.Item className="clickable" onClick={docOpen}>
                <div className="flex-row-start flex-extra">
                  <div className="icon-container">
                    <Image src={thumbnailUrl} className="clickable" />
                  </div>
                  <div>
                    <Header as="h4" content={description} />
                    <p className="slightly-smaller-text">
                      {DateTime.fromISO(timestamp).toLocaleString()}
                    </p>
                    <p className="clickable link-style smaller-text" onClick={docOpen}>
                      {originalFilename}
                    </p>
                  </div>
                </div>
              </List.Item>
            </>
          )
        })}
      </List>
    </Container>
  ) : null
}

export default DocumentsTab
