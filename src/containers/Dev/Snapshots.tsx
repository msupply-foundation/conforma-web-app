import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Icon,
  Input,
  Label,
  Loader,
  Modal,
  Table,
  Header,
  SemanticCOLORS,
  Dropdown,
} from 'semantic-ui-react'
import config from '../../config'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import { useToast } from '../../contexts/Toast'
import { DateTime } from 'luxon'
import TextIO from '../TemplateBuilder/shared/TextIO'
import { fileSizeWithUnits } from '../../utils/helpers/utilityFunctions'

// const diffSnapshotUrl = `${snapshotsBaseUrl}/diff`

type ArchiveType = { type: 'full' | 'none' | 'partial'; from?: string; to?: string }
interface SnapshotData {
  name: string
  size: number
  timestamp: string
  version: string
  archive?: ArchiveType
}

interface ArchiveInfo {
  timestamp: number
  uid: string
  archiveFolder: string
  prevArchiveFolder: string | null
  prevUid: string | null
}

const Snapshots: React.FC = () => {
  const [compareFrom, setCompareFrom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )
  const [archiveStart, setArchiveStart] = useState<number | 'full' | 'none'>()
  const [archiveEnd, setArchiveEnd] = useState<number>()

  const [data, setData] = useState<{
    snapshots: SnapshotData[]
    currentArchives: ArchiveInfo[]
  } | null>(null)

  const { ConfirmModal, showModal } = useConfirmationModal({ type: 'warning', awaitAction: false })
  const showToast = useToast({ style: 'success' })

  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const isProductionBuild = config.isProductionBuild

  useEffect(() => {
    setData(null)
    setCompareFrom('')
    setSnapshotError(null)
    getList()
  }, [])

  const getList = async () => {
    try {
      setData(await getRequest(getServerUrl('snapshot', { action: 'list' })))
    } catch (e) {}
  }

  const normaliseSnapshotName = (name: string) =>
    // not word, not digit
    name.replace(/[^\w\d]/g, '_')

  const takeSnapshot = async (name: string) => {
    if (!name) return
    setIsLoading(true)
    console.log('archiveStart', archiveStart)
    console.log('archiveEnd', archiveEnd)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', { action: 'take', name: normaliseSnapshotName(name) }),
        jsonBody: {
          archive:
            typeof archiveStart === 'string'
              ? archiveStart
              : archiveStart === undefined
              ? 'full'
              : { from: archiveStart, to: archiveEnd },
        },
        headers: { 'Content-Type': 'application/json' },
      })

      if (resultJson.success) {
        await getList()
        setIsLoading(false)
        location.reload(true)
        return
      }

      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while taking snapshot', error })
    }
  }

  const useSnapshot = async (name: string) => {
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', { action: 'use', name }),
      })

      if (resultJson.success) {
        setIsLoading(false)
        location.reload()
        return
      }

      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while loading snapshot', error })
    }
  }

  const deleteSnapshot = async (name: string) => {
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', { action: 'delete', name }),
      })
      if (resultJson.success) {
        await getList()
        setIsLoading(false)
        return
      }
      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while deleting snapshot', error })
    }
  }

  const uploadSnapshot = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files) return

    const file = event.target.files[0]
    const snapshotName = normaliseSnapshotName(file.name.replace('.zip', ''))

    setIsLoading(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const resultJson = await postRequest({
        otherBody: data,
        url: getServerUrl('snapshot', { action: 'upload', name: snapshotName }),
      })

      if (resultJson.success) {
        await getList()
        setIsLoading(false)
        return
      }
      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while uploading snapshot', error })
    }
  }

  const downloadSnapshot = async (snapshotName: string, timestamp: string) => {
    const res = await fetch(getServerUrl('snapshot', { action: 'download', name: snapshotName }), {
      headers: { Authorization: `Bearer ${JWT}` },
    })
    const data = await res.blob()
    var a = document.createElement('a')
    a.href = window.URL.createObjectURL(data)
    a.download = `${snapshotName}_${DateTime.fromISO(timestamp).toFormat(
      'yyyy-LL-dd_HH-mm-ss'
    )}.zip`
    a.click()
  }

  const renderSnapshotList = () => {
    // const compareLinkRef = useRef<HTMLAnchorElement>(null)
    if (!data) return null
    return (
      <>
        {data.snapshots.map(({ name, timestamp, archive, size }) => (
          <Table.Row key={`app_menu_${name}`}>
            <Table.Cell colSpan={12} style={{ padding: 5 }}>
              <div className="flex-row-space-between" style={{ width: '100%', padding: 5 }}>
                <div className="flex-row" style={{ gap: 10 }}>
                  <strong>{name}</strong>
                  <span className="smaller-text">{fileSizeWithUnits(size)}</span>
                </div>
                <div className="flex-row" style={{ gap: 5 }}>
                  <Icon
                    size="large"
                    className="clickable"
                    name="play circle"
                    onClick={() => {
                      if (isProductionBuild)
                        showModal({
                          title: 'Are you sure?',
                          message: `This will overwrite ALL existing data on: ${window.location.host}`,
                          onConfirm: () => useSnapshot(name),
                        })
                      else useSnapshot(name)
                    }}
                  />

                  <Icon
                    size="large"
                    className="clickable"
                    name="record"
                    onClick={() => {
                      if (isProductionBuild)
                        showModal({
                          title: 'Are you sure?',
                          message: `This will overwrite saved snapshot: ${name} with the current system state`,
                          onConfirm: async () => {
                            await takeSnapshot(name)
                            showToast({ title: 'Snapshot saved', text: name })
                          },
                        })
                      else takeSnapshot(name)
                    }}
                  />

                  <Icon
                    name="download"
                    size="large"
                    className="clickable blue"
                    onClick={async () => {
                      showToast({ title: 'Download started...', timeout: 2000 })
                      await downloadSnapshot(name, timestamp)
                      showToast({
                        title: 'Download complete',
                        text: name,
                        timeout: 30000,
                      })
                    }}
                  />

                  <Icon
                    size="large"
                    className="clickable"
                    name="trash alternate"
                    onClick={async () => {
                      await deleteSnapshot(name)
                      showToast({ title: 'Snapshot deleted', text: name })
                    }}
                  />
                </div>
              </div>
              <div className="flex-row" style={{ gap: 10, padding: 5 }}>
                <TextIO
                  text={DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_SHORT)}
                  title="Timestamp"
                  additionalStyles={{ margin: 0 }}
                />
                {archive && (
                  <div className="flex-row-start-center" style={{ gap: 5 }}>
                    <TextIO
                      title={`Archive`}
                      text={`${DateTime.fromISO(
                        archive.from ?? ''
                      ).toLocaleString()} – ${DateTime.fromISO(archive.to ?? '').toLocaleString()}`}
                      additionalStyles={{ margin: 0 }}
                    />
                    {renderArchiveLabel(archive)}
                  </div>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </>
    )
  }

  const resetLoading = () => {
    setSnapshotError(null)
    setIsLoading(false)
  }

  const renderLoadingAndError = () => (
    <Modal open={isLoading} onClick={resetLoading} onClose={resetLoading}>
      {snapshotError ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Label size="large" color="red">
            {snapshotError.message}
            <Icon name="close" onClick={resetLoading} />
          </Label>
          <div style={{ margin: 20 }}>{snapshotError.error}</div>
        </div>
      ) : (
        <Loader active>Loading</Loader>
      )}
    </Modal>
  )

  const renderArchiveLabel = (archive?: ArchiveType) => {
    if (!archive) return null
    let color: SemanticCOLORS
    let text: string
    switch (archive.type) {
      case 'full':
        color = 'green'
        text = 'FULL'
        break
      case 'partial':
        color = 'orange'
        text = 'PARTIAL'
        break
      default:
        color = 'red'
        text = 'No archive'
    }
    return <Label content={text} color={color} size="mini" />
  }

  const newSnapshot = () => {
    const [name, setName] = useState('')
    return (
      <Table.Cell className="flex-row-start-center" style={{ gap: 10, padding: 15 }}>
        <div className="flex-column" style={{ gap: 10, width: '100%' }}>
          <Input
            onChange={(_, { value }) => setName(value)}
            placeholder="Enter snapshot name"
            style={{ width: 200 }}
          />
          {data && data.currentArchives?.length > 0 && (
            <div className="flex-row-start-center" style={{ gap: 10 }}>
              {typeof archiveStart === 'number' && <span>From: </span>}
              <Dropdown
                placeholder="Select earliest archive"
                selection
                clearable
                value={archiveStart}
                options={[
                  { key: 'none', value: 'none', text: 'No archive' },
                  { key: 'full', value: 'full', text: 'Include full archive' },
                  ...data?.currentArchives.map(({ timestamp, uid }) => ({
                    text: DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_SHORT),
                    value: timestamp,
                    key: uid,
                  })),
                ]}
                onChange={(_, { value }) => {
                  setArchiveStart(value as number | 'none' | 'full')
                  if (value === 'none' || value === 'full') setArchiveEnd(undefined)
                }}
                style={{ maxWidth: 350 }}
              />
              {typeof archiveStart === 'number' &&
                data?.currentArchives.filter(({ timestamp }) => timestamp > archiveStart).length >
                  0 && (
                  <>
                    <span>to: </span>
                    <Dropdown
                      placeholder="Select latest archive"
                      selection
                      clearable
                      value={archiveEnd}
                      options={[
                        ...data?.currentArchives
                          .filter(({ timestamp }) => timestamp > archiveStart)
                          .map(({ timestamp, uid }) => ({
                            text: DateTime.fromMillis(timestamp).toLocaleString(
                              DateTime.DATETIME_SHORT
                            ),
                            value: timestamp,
                            key: uid,
                          })),
                      ]}
                      onChange={(_, { value }) => {
                        setArchiveEnd(value as number)
                      }}
                      style={{ maxWidth: 350 }}
                    />
                  </>
                )}
            </div>
          )}
        </div>
        <div className="flex-column" style={{ gap: 10 }}>
          <Header as="h4" style={{ marginBottom: 0, textAlign: 'center' }}>
            Create new snapshot
          </Header>
          <Button
            primary
            onClick={() => {
              takeSnapshot(name)
            }}
            content="Save"
          />
        </div>
      </Table.Cell>
    )
  }

  const renderUploadSnapshot = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    if (compareFrom !== '') return null
    // />
    return (
      <div>
        <Button primary inverted onClick={() => fileInputRef?.current?.click()}>
          Upload <Icon name="upload" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".zip"
          hidden
          name="file"
          multiple={false}
          onChange={(e) => uploadSnapshot(e)}
        />
      </div>
    )
  }

  return (
    <div id="list-container" style={{ minWidth: 500, maxWidth: 700 }}>
      <ConfirmModal />
      <div className="flex-row-space-between">
        <Header>Snapshots</Header>
        {renderUploadSnapshot()}
      </div>
      <Table stackable>
        <Table.Body>
          <Table.Row>{newSnapshot()}</Table.Row>
          {renderSnapshotList()}
        </Table.Body>
      </Table>
      {renderLoadingAndError()}
    </div>
  )
}

export default Snapshots
