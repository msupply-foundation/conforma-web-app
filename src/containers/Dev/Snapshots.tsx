import React, { useState, useEffect, useCallback } from 'react'
import {
  Button,
  Icon,
  Input,
  Label,
  Loader,
  Modal,
  Table,
  Header,
  Dropdown,
  Form,
  List,
  Checkbox,
} from 'semantic-ui-react'
import config from '../../config'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import useConfirmationModal from '../../utils/hooks/useConfirmationModal'
import { useToast } from '../../contexts/Toast'
import { DateTime } from 'luxon'
import TextIO from '../TemplateBuilder/shared/TextIO'
import { downloadFile, fileSizeWithUnits } from '../../utils/helpers/utilityFunctions'
import { Tooltip, UploadButton } from '../../components/common'
import { usePrefs } from '../../contexts/SystemPrefs'
import { BrowserNotifications } from '../../utils/browserNotifications'

interface SnapshotData {
  name: string
  filename: string
  size: number
  timestamp: string
  version: string
  missingArchives: string[]
  archiveSize: number
}

interface ArchiveInfo {
  timestamp: number
  uid: string
  archiveFolder: string
  prevArchiveFolder: string | null
  prevUid: string | null
  totalFileSize?: number
}

interface ListData {
  snapshots: SnapshotData[]
  orphanArchives: string[]
}

const Snapshots: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )
  const [selectedDownload, setSelectedDownload] = useState<{ name: string; size?: number }>()
  const [expandedSnapshots, setExpandedSnapshots] = useState<string[]>([])
  const [archive, setArchive] = useState<number | 'full' | 'none'>()
  const [archiveEnd, setArchiveEnd] = useState<number>()
  const [refetchData, setRefetchData] = useState(false)
  const { maintenanceMode } = usePrefs()

  const [data, setData] = useState<ListData | null>(null)

  const { ConfirmModal, showModal } = useConfirmationModal({ type: 'warning', awaitAction: false })
  const { showToast } = useToast({ style: 'success' })

  // const JWT = localStorage.getItem(config.localStorageJWTKey)
  const isProductionBuild = config.isProductionBuild

  BrowserNotifications.checkPermission()

  useEffect(() => {
    // updateQuery({ type: displayType })
    setData(null)
    setSnapshotError(null)
    getList()
  }, [refetchData])

  const getList = async () => {
    try {
      setData(await getRequest(getServerUrl('snapshot', { action: 'list' })))
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
          // archive: displayType === 'archives',
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
        await getList()
        setIsLoading(false)
        BrowserNotifications.notify({
          title: 'Snapshot saved',
          body: name,
          onFocus: () => {
            // if (displayType === 'snapshots')
            location.reload()
          },
        })
        if (document.hasFocus()) location.reload()
        return
      }
      setSnapshotError(resultJson)
      BrowserNotifications.notify({
        title: 'Problem taking snapshot',
        body: name,
      })
    } catch (error) {
      setSnapshotError({
        message: 'Front end error while taking snapshot',
        error: (error as Error).message,
      })
      BrowserNotifications.notify({
        title: 'Problem taking snapshot',
        body: name,
      })
    }
  }

  const loadSnapshot = async (name: string) => {
    const maintenanceModeAlreadyEnabled = maintenanceMode.enabled
    if (!maintenanceModeAlreadyEnabled && isProductionBuild) {
      console.log('Enabling maintenance mode')
      await postRequest({
        url: getServerUrl('setMaintenanceMode'),
        jsonBody: { enabled: true },
        headers: { 'Content-Type': 'application/json' },
      })
    }
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', { action: 'use', name }),
        timeout: 10 * 60, // Ten minutes
      })

      if (resultJson.success) {
        setIsLoading(false)
        BrowserNotifications.notify({
          title: 'Snapshot loaded',
          body: name,
          onFocus: () => location.reload(),
        })
        return
      }
      setSnapshotError(resultJson)
      BrowserNotifications.notify({
        title: 'Problem loading snapshot',
        body: name,
      })
    } catch (error) {
      setSnapshotError({
        message: 'Front end error while loading snapshot',
        error: (error as Error).message,
      })
      BrowserNotifications.notify({
        title: 'Problem loading snapshot',
        body: name,
      })
    } finally {
      // Only re-enable maintenance mode if it wasn't already on before
      // snapshot load
      if (!maintenanceModeAlreadyEnabled && isProductionBuild) {
        console.log('Disabling maintenance mode')
        await postRequest({
          url: getServerUrl('setMaintenanceMode'),
          jsonBody: { enabled: false },
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
  }

  const deleteSnapshot = async (name: string) => {
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', {
          action: 'delete',
          name,
          // archive: displayType === 'archives',
        }),
      })
      if (resultJson.success) {
        await getList()
        setIsLoading(false)
        return
      }
      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({
        message: 'Front end error while deleting snapshot',
        error: (error as Error).message,
      })
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
        await getList()
        setIsLoading(false)
        BrowserNotifications.notify({
          title: 'Snapshot uploaded',
          body: file.name,
        })
        return
      }
      setSnapshotError(resultJson)
      BrowserNotifications.notify({
        title: 'Problem uploading snapshot',
        body: file.name,
      })
    } catch (error) {
      setSnapshotError({
        message: 'Front end error while uploading snapshot',
        error: (error as Error).message,
      })
      BrowserNotifications.notify({
        title: 'Problem uploading snapshot',
        body: file.name,
      })
    }
  }

  const renderSingleSnapshot = (
    { name, filename, timestamp, size, version, missingArchives, archiveSize }: SnapshotData,
    hasChildren = false
  ) => (
    <Table.Row key={filename}>
      <Table.Cell style={{ padding: 5 }}>
        <div className="flex-row-space-between" style={{ width: '100%', padding: 5 }}>
          <div className="flex-row" style={{ gap: 10 }}>
            <strong>{name}</strong>
            <span className="smaller-text">{size ? fileSizeWithUnits(size) : 'Size unknown'}</span>
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
                    onConfirm: () => loadSnapshot(filename),
                  })
                else loadSnapshot(filename)
              }}
            />
            <Icon
              name="download"
              size="large"
              className="clickable blue"
              onClick={() => setSelectedDownload({ name: filename, size })}
            />

            <Icon
              size="large"
              className="clickable"
              name="trash alternate"
              onClick={async () => {
                await deleteSnapshot(filename)
                showToast({
                  title: 'Snapshot deleted',
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
          <TextIO text={version} title="Created with version" additionalStyles={{ margin: 0 }} />
          {archiveSize > 0 && (
            <TextIO
              text={fileSizeWithUnits(archiveSize)}
              title="Archives"
              additionalStyles={{ margin: 0 }}
            />
          )}
          {archiveSize > 0 && missingArchives.length > 0 && (
            <div className="flex-row-start-center" style={{ gap: 5 }}>
              <Tooltip
                message={`**Warning:** some archives required by this snapshot are missing from the system:\n\n${missingArchives.join(
                  '  \n'
                )}`}
                color="red"
                icon="exclamation triangle"
                iconStyle={{ marginLeft: -5, height: 'auto' }}
                className="smaller-text-tooltip"
                triggerEvent="hover"
              />
            </div>
          )}
        </div>
        {hasChildren && (
          <div
            className="flex-row-start-center clickable"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              if (e.getModifierState('Meta') || e.getModifierState('Control')) {
                setExpandedSnapshots([])
                return
              }
              if (expandedSnapshots.includes(name))
                setExpandedSnapshots(expandedSnapshots.filter((el) => el !== name))
              else setExpandedSnapshots([...expandedSnapshots, name])
            }}
          >
            <Icon
              size="large"
              name="dropdown"
              style={{
                transform: expandedSnapshots.includes(name) ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: '0.2s',
              }}
            />
            <p className="smaller-text">Show all</p>
          </div>
        )}
      </Table.Cell>
    </Table.Row>
  )

  const renderSnapshotList = () => {
    if (!data) return null
    const nestedSnapshots = getNestedSnapshots(data.snapshots)
    return nestedSnapshots.map((snapshot) => (
      <React.Fragment key={snapshot.filename}>
        {renderSingleSnapshot(snapshot, snapshot.otherVersions.length > 0)}
        {expandedSnapshots.includes(snapshot.name) && (
          <Table.Row>
            <Table.Cell style={{ background: 'transparent', paddingRight: 0 }}>
              <Table style={{ marginTop: -14, marginBottom: -10 }}>
                <Table.Body>
                  {snapshot.otherVersions.map((snapshot) => renderSingleSnapshot(snapshot))}
                </Table.Body>
              </Table>
            </Table.Cell>
          </Table.Row>
        )}
      </React.Fragment>
    ))
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
          <div style={{ margin: 20 }}>
            {snapshotError.error.split('\n').map((line) => (
              <>
                <span>{line}</span>
                <br />
              </>
            ))}
          </div>
        </div>
      ) : (
        <Loader active>Loading</Loader>
      )}
    </Modal>
  )

  const NewSnapshot = () => {
    const [name, setName] = useState(localStorage.getItem('defaultSnapshotName') ?? '')

    return (
      <Table.Row>
        <Table.Cell
          className="flex-row-start"
          style={{ gap: 10, padding: 15, alignItems: 'flex-end' }}
        >
          <div className="flex-column-start-start" style={{ gap: 10, width: '100%' }}>
            <Header as="h4" style={{ marginBottom: 0 }}>
              Create new snapshot:
            </Header>
            <Input
              onChange={(_, { value }) => setName(value)}
              value={name}
              placeholder="Enter snapshot name"
              style={{ width: 250 }}
            />
          </div>
          <Button
            primary
            disabled={!name}
            onClick={() => {
              takeSnapshot(name)
            }}
            content="Save"
            style={{ minWidth: 100 }}
          />
        </Table.Cell>
      </Table.Row>
    )
  }

  const renderOrphans = (orphans: string[]) => {
    return (
      <Table.Row>
        <Table.Cell className="flex-row-start-center">
          <div className="flex-column-start-start" style={{ margin: 8 }}>
            <p style={{ marginBottom: 6, marginTop: 0 }}>
              The following stored archives are no longer part of any snapshot, so can be safely
              deleted:
            </p>
            <List bulleted style={{ textAlign: 'left' }}>
              {orphans.map((archive) => (
                <List.Item key={archive} className="slightly-smaller-text">
                  {archive}
                </List.Item>
              ))}
            </List>
            <div className="spacer-10" />
            <Button
              primary
              onClick={async () => {
                const result = await postRequest({
                  url: getServerUrl('snapshot', { action: 'purge' }),
                })
                showToast({
                  title: 'Archives purged',
                  text: result.message,
                })
                getList()
              }}
              content="Zap 'em"
            />
          </div>
        </Table.Cell>
      </Table.Row>
    )
  }

  const renderUploadSnapshot = () => {
    return (
      <div>
        <UploadButton primary inverted handleFiles={uploadSnapshot}>
          Upload <Icon name="upload" style={{ paddingLeft: 5 }} />
        </UploadButton>
      </div>
    )
  }

  const orphanArchives = data?.orphanArchives ?? []

  return (
    <div id="list-container" style={{ minWidth: 500, maxWidth: 750 }}>
      <ConfirmModal />
      <DownloadModal snapshot={selectedDownload} onClose={() => setSelectedDownload(undefined)} />
      <div className="flex-row-space-between">
        <Header>Snapshots</Header>
        {renderUploadSnapshot()}
      </div>
      <Table stackable style={{ marginTop: 0 }}>
        <Table.Body>
          <NewSnapshot />
          {renderSnapshotList()}
          {orphanArchives.length > 0 && renderOrphans(orphanArchives)}
        </Table.Body>
      </Table>
      {renderLoadingAndError()}
    </div>
  )
}

interface DownloadModalProps {
  snapshot?: { name: string; size?: number }
  onClose: () => void
}

interface DownloadOptions {
  includeSnapshot: boolean
  archiveRange?: { from?: number; to?: number }
  zlibCompression?: number // 0-9, where 0 is no compression and 9 is maximum compression (but slowest) -- default 6
}

const DownloadModal = ({ onClose, snapshot }: DownloadModalProps) => {
  const [archives, setArchives] = useState<ArchiveInfo[]>([])
  const [downloadOptions, setDownloadOptions] = useState<DownloadOptions>({
    includeSnapshot: true,
    zlibCompression: 6,
  })

  const { showToast } = useToast({ style: 'success' })

  const reset = useCallback(() => {
    console.log('Resetting')
    setArchives([])
    setDownloadOptions({ includeSnapshot: true, zlibCompression: 6 })
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!snapshot?.name) return

    const name = snapshot.name

    getRequest(getServerUrl('snapshot', { action: 'fetch-archives', name })).then(({ archives }) =>
      setArchives(archives)
    )

    return reset
  }, [snapshot?.name, reset])

  // Archive options for dropdowns

  const options =
    archives?.map(({ timestamp, totalFileSize, uid }) => ({
      text: `${DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_SHORT)}${
        totalFileSize ? ` (${fileSizeWithUnits(totalFileSize)})` : ''
      }`,
      value: timestamp,
      key: uid,
    })) ?? []

  const startArchiveOptions = options?.filter(
    (option) => option.value <= (downloadOptions.archiveRange?.to ?? Infinity)
  )

  const endArchiveOptions = options?.filter(
    (option) => option.value >= (downloadOptions.archiveRange?.from ?? 0)
  )

  const selectedArchives =
    downloadOptions.archiveRange?.from === undefined &&
    downloadOptions.archiveRange?.to === undefined
      ? []
      : archives?.filter((archive) => {
          return (
            archive.timestamp >= (downloadOptions.archiveRange?.from ?? 0) &&
            archive.timestamp <= (downloadOptions.archiveRange?.to ?? Infinity)
          )
        })

  const totalArchiveSize = getTotalSize(
    downloadOptions.archiveRange?.from,
    downloadOptions.archiveRange?.to,
    archives
  )

  const totalDownloadSize =
    typeof snapshot?.size !== 'number' || typeof totalArchiveSize !== 'number'
      ? 'Unknown'
      : (downloadOptions.includeSnapshot ? snapshot.size : 0) + totalArchiveSize

  const handleSubmit = async () => {
    onClose()
    if (!snapshot?.name) return

    const outputFilename = getFilename(snapshot.name, downloadOptions)

    const toastId = showToast({
      uid: 'test',
      title: 'Download requested...',
      text: snapshot.name,
      timeout: 0,
    })

    const slowRequestTimer = setTimeout(() => {
      showToast({
        uid: toastId,
        title: '',
        text: '🥱 Zip archive creation is taking a while, please stand by...',
        timeout: 0,
        style: 'warning',
      })
    }, 10_000)

    const response = await postRequest({
      url: getServerUrl('snapshot', { action: 'download', name: snapshot?.name }),
      jsonBody: downloadOptions,
      headers: { 'Content-Type': 'application/json' },
    })

    clearTimeout(slowRequestTimer)

    showToast({
      uid: toastId,
      title: 'Download starting...',
      text: '',
      timeout: 5_000,
      style: 'success',
    })

    const zipFile = response?.zipFileName

    const fileUrl = getServerUrl('file', { zipFile })

    downloadFile(fileUrl, outputFilename)

    BrowserNotifications.notify({ title: 'Snapshot downloaded', body: snapshot.name })
  }

  return (
    <Modal open={!!snapshot} onClose={onClose} closeIcon>
      <Modal.Header>Download {snapshot?.name}</Modal.Header>
      <Modal.Content>
        <Form className="flex-column" style={{ gap: 25 }}>
          <Checkbox
            label={`Include snapshot file (${
              snapshot?.size ? fileSizeWithUnits(snapshot.size) : 'Size unknown'
            })`}
            checked={downloadOptions.includeSnapshot}
            onChange={(_, { checked }) =>
              setDownloadOptions((options) => ({ ...options, includeSnapshot: !!checked }))
            }
          />
          <div className="flex-column" style={{ gap: 10 }}>
            <div>Include Archives:</div>
            <div className="flex-row-start-center" style={{ gap: 10 }}>
              <span>From: </span>
              <Dropdown
                placeholder="Select earliest archive"
                selection
                clearable
                value={downloadOptions.archiveRange?.from}
                options={startArchiveOptions}
                onChange={(_, { value }) => {
                  const archiveRange = {
                    ...downloadOptions.archiveRange,
                    from: value === '' ? undefined : (value as number),
                  }
                  // If "from" value is cleared, also clear "to" value since it
                  // doesn't make sense to have a "to" without a "from"
                  if (value === '') archiveRange.to = undefined
                  setDownloadOptions((options) => ({
                    ...options,
                    archiveRange: archiveRange,
                  }))
                }}
                style={{ maxWidth: 400, fontSize: '90%' }}
              />
              {downloadOptions.archiveRange?.from && (
                <>
                  <span>to: </span>
                  <Dropdown
                    placeholder="Select latest archive"
                    selection
                    clearable
                    value={downloadOptions.archiveRange?.to}
                    options={endArchiveOptions}
                    onChange={(_, { value }) =>
                      setDownloadOptions((options) => ({
                        ...options,
                        archiveRange: {
                          ...options.archiveRange,
                          to: value === '' ? undefined : (value as number),
                        },
                      }))
                    }
                    style={{ maxWidth: 400, fontSize: '90%' }}
                  />
                </>
              )}
              {selectedArchives?.length > 0 && (
                <span>Total size: {fileSizeWithUnits(totalArchiveSize)}</span>
              )}
            </div>
          </div>
          <div>
            Total download size <em>(before Zip compression)</em>:{' '}
            <strong>{fileSizeWithUnits(totalDownloadSize)}</strong>
          </div>
          <div className="flex-column" style={{ gap: 10 }}>
            <span>
              Zip compression level:
              <br />
              <span className="smaller-text">
                <em>(0: no compression, 9: maximum compression, slowest)</em>
              </span>
            </span>
            <Form.Input
              type={'number'}
              min={0}
              max={9}
              value={downloadOptions.zlibCompression}
              style={{ maxWidth: 100 }}
              onChange={(e) =>
                setDownloadOptions((options) => ({
                  ...options,
                  zlibCompression: Number(e.target.value),
                }))
              }
            />
          </div>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={handleSubmit}
          primary
          content={'Go'}
          disabled={
            !downloadOptions.includeSnapshot &&
            !downloadOptions.archiveRange?.from &&
            !downloadOptions.archiveRange?.to
          }
        />
      </Modal.Actions>
    </Modal>
  )
}

const getTotalSize = (
  archiveStart: number | undefined,
  archiveEnd: number | undefined,
  currentArchives: ArchiveInfo[] | undefined
) => {
  if (!currentArchives) return null
  if (!archiveStart && !archiveEnd) return 0

  const start = archiveStart ?? 0
  const end = archiveEnd ?? Infinity

  const includedArchives = currentArchives.filter(
    (archive) => archive.timestamp >= start && archive.timestamp <= end
  )
  if (includedArchives.some((archive) => !archive.totalFileSize)) return 'Unknown'

  return includedArchives.reduce((sum, archive) => sum + (archive.totalFileSize ?? 0), 0)
}

const getNestedSnapshots = (snapshots: SnapshotData[]) => {
  const nestedSnapshots: (SnapshotData & { otherVersions: SnapshotData[] })[] = []
  snapshots.forEach((snapshot) => {
    const outer = nestedSnapshots.find((el) => el.name === snapshot.name)
    if (outer) outer.otherVersions.push(snapshot)
    else nestedSnapshots.push({ ...snapshot, otherVersions: [] })
  })
  return nestedSnapshots
}

const getFilename = (name: string, downloadOptions: DownloadOptions): string => {
  const { includeSnapshot, archiveRange } = downloadOptions

  // No archive options set
  if (!archiveRange?.from && !archiveRange?.to) {
    return `${name}.zip`
  }

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return DateTime.fromMillis(timestamp).toFormat('yyyy_MM_dd')
  }

  // Build date range string
  let dateString = ''
  if (archiveRange.from && archiveRange.to) {
    dateString = `${formatDate(archiveRange.from)}-${formatDate(archiveRange.to)}`
  } else if (archiveRange.from) {
    dateString = formatDate(archiveRange.from)
  } else if (archiveRange.to) {
    dateString = formatDate(archiveRange.to)
  }

  // Build filename based on whether snapshot is included
  if (includeSnapshot) {
    return `${name} [+ARCHIVE ${dateString}].zip`
  } else {
    return `${name} - ARCHIVE ONLY ${dateString}.zip`
  }
}

export default Snapshots
