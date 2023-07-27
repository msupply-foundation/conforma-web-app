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
  Form,
} from 'semantic-ui-react'
import config from '../../config'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import { useToast } from '../../contexts/Toast'
import { DateTime } from 'luxon'
import TextIO from '../TemplateBuilder/shared/TextIO'
import { fileSizeWithUnits } from '../../utils/helpers/utilityFunctions'
import { useRouter } from '../../utils/hooks/useRouter'

type ArchiveType = { type: 'full' | 'none' | 'partial'; from?: string; to?: string }
interface SnapshotData {
  name: string
  filename: string
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

type SnapshotType = 'snapshots' | 'archives'

const Snapshots: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )
  const { query, updateQuery } = useRouter()
  const [displayType, setDisplayType] = useState<SnapshotType>(
    (query.type as SnapshotType) ?? 'snapshots'
  )
  const [archive, setArchive] = useState<number | 'full' | 'none'>()
  const [archiveEnd, setArchiveEnd] = useState<number>()
  const [refetchData, setRefetchData] = useState(false)

  const [data, setData] = useState<{
    snapshots: SnapshotData[]
    currentArchives: ArchiveInfo[]
  } | null>(null)

  const { ConfirmModal, showModal } = useConfirmationModal({ type: 'warning', awaitAction: false })
  const showToast = useToast({ style: 'success' })

  const JWT = localStorage.getItem(config.localStorageJWTKey)
  const isProductionBuild = config.isProductionBuild

  useEffect(() => {
    updateQuery({ type: displayType })
    setData(null)
    setSnapshotError(null)
    getList(displayType)
  }, [displayType, refetchData])

  const getList = async (displayType: SnapshotType) => {
    try {
      setData(
        await getRequest(
          getServerUrl('snapshot', { action: 'list', archive: displayType === 'archives' })
        )
      )
    } catch (e) {}
  }

  const normaliseSnapshotName = (name: string) =>
    // Not word, not digit
    name.replace(/[^\w\d-]/g, '_')

  const takeSnapshot = async (name: string) => {
    if (!name) return

    localStorage.setItem('defaultSnapshotName', name)

    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', {
          action: 'take',
          name: normaliseSnapshotName(name),
          archive: displayType === 'archives',
        }),
        jsonBody: {
          archive:
            typeof archive === 'string'
              ? archive
              : archive === undefined
              ? 'full'
              : { from: archive, to: archiveEnd },
        },
        headers: { 'Content-Type': 'application/json' },
      })

      if (resultJson.success) {
        await getList(displayType)
        setIsLoading(false)
        if (displayType === 'snapshots') location.reload()
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
        url: getServerUrl('snapshot', {
          action: 'delete',
          name,
          archive: displayType === 'archives',
        }),
      })
      if (resultJson.success) {
        await getList(displayType)
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

    setIsLoading(true)
    try {
      const data = new FormData()
      data.append('file', file)

      const resultJson = await postRequest({
        otherBody: data,
        url: getServerUrl('snapshot', { action: 'upload' }),
      })

      if (resultJson.success) {
        await getList(displayType)
        setIsLoading(false)
        return
      }
      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while uploading snapshot', error })
    }
  }

  const downloadSnapshot = async (name: string) => {
    const res = await fetch(
      getServerUrl('snapshot', {
        action: 'download',
        name,
        archive: displayType === 'archives',
      }),
      {
        headers: { Authorization: `Bearer ${JWT}` },
      }
    )
    const data = await res.blob()
    var a = document.createElement('a')
    a.href = window.URL.createObjectURL(data)
    a.download = `${displayType === 'archives' ? 'ARCHIVE_' : ''}${name}.zip`
    a.click()
  }

  const renderSnapshotList = () => {
    if (!data) return null
    return (
      <>
        {data.snapshots.map(({ name, filename, timestamp, archive, size }) => (
          <Table.Row key={filename}>
            <Table.Cell colSpan={12} style={{ padding: 5 }}>
              <div className="flex-row-space-between" style={{ width: '100%', padding: 5 }}>
                <div className="flex-row" style={{ gap: 10 }}>
                  <strong>{name}</strong>
                  <span className="smaller-text">
                    {size ? fileSizeWithUnits(size) : 'Size unknown'}
                  </span>
                </div>
                <div className="flex-row" style={{ gap: 5 }}>
                  {displayType === 'snapshots' && (
                    <Icon
                      size="large"
                      className="clickable"
                      name="play circle"
                      onClick={() => {
                        if (isProductionBuild)
                          showModal({
                            title: 'Are you sure?',
                            message: `This will overwrite ALL existing data on: ${window.location.host}`,
                            onConfirm: () => useSnapshot(filename),
                          })
                        else useSnapshot(filename)
                      }}
                    />
                  )}
                  <Icon
                    name="download"
                    size="large"
                    className="clickable blue"
                    onClick={async () => {
                      showToast({ title: 'Download started...', timeout: 2000 })
                      await downloadSnapshot(filename)
                      showToast({
                        title: 'Download complete',
                        text: `${displayType === 'archives' ? 'ARCHIVE_' : ''}${filename}`,
                        timeout: 30000,
                      })
                    }}
                  />

                  <Icon
                    size="large"
                    className="clickable"
                    name="trash alternate"
                    onClick={async () => {
                      await deleteSnapshot(filename)
                      showToast({
                        title: `${
                          displayType === 'archives' ? 'Archive snapshot' : 'Snapshot'
                        } deleted`,
                        text: name,
                      })
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
                    {archive.type !== 'none' && (
                      <TextIO
                        title={`Archive`}
                        text={`${DateTime.fromISO(
                          archive.from ?? ''
                        ).toLocaleString()} – ${DateTime.fromISO(
                          archive.to ?? ''
                        ).toLocaleString()}`}
                        additionalStyles={{ margin: 0 }}
                      />
                    )}
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
    <Modal open={isLoading} onClose={resetLoading}>
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

  const renderNewSnapshot = () => {
    const [name, setName] = useState(localStorage.getItem('defaultSnapshotName') ?? '')
    const archiveOptions =
      data && data.currentArchives?.length > 0
        ? [
            { key: 'full', value: 'full', text: 'Include full archive' },
            ...data?.currentArchives.map(({ timestamp, uid }) => ({
              text: DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_SHORT),
              value: timestamp,
              key: uid,
            })),
          ]
        : []
    if (displayType === 'snapshots' && archiveOptions.length > 0)
      archiveOptions.unshift({ key: 'none', value: 'none', text: 'No archive' })

    const archiveEndOptions =
      typeof archive === 'number'
        ? archiveOptions.filter(({ value }) => typeof value === 'number' && value >= archive)
        : []

    const hasArchives = data && data.currentArchives?.length > 0

    return (
      <Table.Cell className="flex-row-start-center" style={{ gap: 10, padding: 15 }}>
        <div className="flex-column" style={{ gap: 10, width: '100%' }}>
          <Input
            onChange={(_, { value }) => setName(value)}
            value={name}
            placeholder="Enter snapshot name"
            style={{ width: 200 }}
          />
          {hasArchives && (
            <div className="flex-row-start-center" style={{ gap: 10 }}>
              {typeof archive === 'number' && <span>From: </span>}
              <Dropdown
                placeholder="Select earliest archive"
                selection
                clearable
                value={archive}
                options={archiveOptions}
                onChange={(_, { value }) => {
                  setArchive(value as number | 'none' | 'full')
                  if (value === 'none' || value === 'full') setArchiveEnd(undefined)
                }}
                style={{ maxWidth: 350 }}
              />
              {typeof archive === 'number' &&
                data &&
                data?.currentArchives.filter(({ timestamp }) => timestamp > archive).length > 0 && (
                  <>
                    <span>to: </span>
                    <Dropdown
                      placeholder="Select latest archive"
                      selection
                      clearable
                      value={archiveEnd}
                      options={archiveEndOptions}
                      onChange={(_, { value }) => {
                        setArchiveEnd(value === '' ? undefined : (value as number))
                      }}
                      style={{ maxWidth: 350 }}
                    />
                  </>
                )}
            </div>
          )}
        </div>
        <div className="flex-column" style={{ gap: 10 }}>
          <Header as="h4" style={{ marginBottom: 0, textAlign: 'center', maxWidth: 250 }}>
            {`Create new ${displayType === 'archives' ? 'Archive ' : ''}snapshot`}
          </Header>
          <Button
            primary
            disabled={
              !name || (hasArchives && !archive) || (displayType === 'archives' && !archive)
            }
            onClick={() => {
              takeSnapshot(name)
            }}
            content="Save"
          />
        </div>
      </Table.Cell>
    )
  }

  const renderArchiveFiles = () => {
    const [days, setDays] = useState(7)
    const [loading, setLoading] = useState(false)

    const archiveFiles = async () => {
      setLoading(true)
      const result = await getRequest(getServerUrl('archiveFiles', { days }))
      showToast({
        title: result === null ? 'Nothing to archive' : 'Archive complete',
        text: result === null ? undefined : `${result.numFiles} files archived`,
        style: result ? 'success' : 'warning',
      })
      setLoading(false)
      setRefetchData(!refetchData)
    }

    return (
      <div style={{ display: displayType === 'snapshots' ? 'none' : 'block' }}>
        <Header as="h3">Create a new archive</Header>
        <div className="flex-row-space-between-center" style={{ marginTop: 10 }}>
          <div className="flex-row-start-center" style={{ gap: 5 }}>
            Archive files older than
            <Form.Input
              size="mini"
              type="number"
              min={1}
              value={days}
              onChange={(e) => {
                const num = Number(e.target.value)
                if (num < 1) setDays(1)
                else setDays(num)
              }}
              style={{ maxWidth: 65 }}
            />
            days
          </div>
          <Button
            primary
            inverted
            loading={loading}
            onClick={() =>
              showModal({
                title: 'Make a new archive?',
                message: `This will archive system files older than ${days} days. Are you sure?`,
                onConfirm: archiveFiles,
              })
            }
          >
            Archive <Icon name="archive" style={{ paddingLeft: 5, transform: 'translateY(0px)' }} />
          </Button>
        </div>
      </div>
    )
  }

  const renderUploadSnapshot = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    return (
      <div>
        <Button primary inverted onClick={() => fileInputRef?.current?.click()}>
          Upload <Icon name="upload" style={{ paddingLeft: 5 }} />
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
      <Header>Snapshots</Header>
      <div className="flex-row-space-between">
        <div className="flex-row-start-center" style={{ gap: 10 }}>
          Show:
          <Dropdown
            selection
            value={displayType}
            options={[
              { key: 'snapshots', value: 'snapshots', text: 'Snapshots' },
              { key: 'archives', value: 'archives', text: 'Archive snapshots' },
            ]}
            onChange={(_, { value }) => setDisplayType(value as SnapshotType)}
            style={{ maxWidth: 350 }}
          />
        </div>
        {renderUploadSnapshot()}
      </div>
      <Table stackable style={{ marginTop: 0 }}>
        <Table.Body>
          <Table.Row>{renderNewSnapshot()}</Table.Row>
          {renderSnapshotList()}
        </Table.Body>
      </Table>
      {renderLoadingAndError()}
      {renderArchiveFiles()}
    </div>
  )
}

export default Snapshots
