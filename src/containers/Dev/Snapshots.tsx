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

const Snapshots: React.FC = () => {
  const [compareFrom, setCompareFrom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )

  const [data, setData] = useState<SnapshotData[] | null>(null)

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
      const snapshotListRaw = await getRequest(getServerUrl('snapshot', { action: 'list' }))

      setData(snapshotListRaw)
    } catch (e) {}
  }

  const normaliseSnapshotName = (name: string) =>
    // not word, not digit
    name.replace(/[^\w\d]/g, '_')

  const takeSnapshot = async (name: string) => {
    if (!name) return
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: getServerUrl('snapshot', { action: 'take', name: normaliseSnapshotName(name) }),
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

  const downloadSnapshot = async (snapshotName: string) => {
    const res = await fetch(getServerUrl('snapshot', { action: 'download', name: snapshotName }), {
      headers: { Authorization: `Bearer ${JWT}` },
    })
    const data = await res.blob()
    var a = document.createElement('a')
    a.href = window.URL.createObjectURL(data)
    a.download = `${snapshotName}.zip`
    a.click()
  }

  const renderSnapshotList = () => {
    // const compareLinkRef = useRef<HTMLAnchorElement>(null)
    if (!data) return null
    return (
      <>
        {data.map(({ name, timestamp, archive, size }) => (
          <Table.Row key={`app_menu_${name}`}>
            <Table.Cell colSpan={12} style={{ padding: 5 }}>
              <div className="flex-row-space-between" style={{ width: '100%', padding: 5 }}>
                <div className="flex-row" style={{ gap: 30 }}>
                  <strong>{name}</strong>
                  <span className="smaller-text">{fileSizeWithUnits(size)}</span>
                  {renderArchiveLabel(archive)}
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
                      await downloadSnapshot(name)
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
              <div className="flex-row">
                <TextIO
                  text={DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_SHORT)}
                  title="Timestamp"
                />
                {archive && (
                  <div className="flex-row">
                    <TextIO
                      title="Archive"
                      text={`${DateTime.fromISO(
                        archive.from ?? ''
                      ).toLocaleString()}–${DateTime.fromISO(archive.to ?? '').toLocaleString()}`}
                    />
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
        text = 'Full archive'
        break
      case 'partial':
        color = 'blue'
        text = 'Partial archive'
        break
      default:
        color = 'red'
        text = 'No archive'
    }
    return (
      <Label
        // className="stage-label"
        content={text}
        color={color}
        size="small"
      />
    )
  }

  const newSnapshot = () => {
    const [value, setValue] = useState('')
    if (compareFrom !== '') return null
    return (
      <>
        <Table.Cell>
          <div className="flex-row-start" style={{ alignItems: 'center' }}>
            <Input
              size="mini"
              onChange={(_, { value }) => setValue(value)}
              placeholder="New Snapshot"
              style={{ paddingRight: 10 }}
            />
            <Icon
              size="large"
              className="clickable"
              name="record"
              onClick={() => takeSnapshot(value)}
            />
          </div>
        </Table.Cell>
      </>
    )
  }

  const renderUploadSnapshot = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    if (compareFrom !== '') return null
    // />
    return (
      <>
        <Table.Cell colSpan={4} textAlign="right">
          <Button primary onClick={() => fileInputRef?.current?.click()}>
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
        </Table.Cell>
      </>
    )
  }

  return (
    <div id="list-container" style={{ width: 400 }}>
      <ConfirmModal />
      <Header>Snapshots</Header>
      <Table stackable>
        <Table.Body>
          <Table.Row>
            {newSnapshot()}
            {renderUploadSnapshot()}
          </Table.Row>
          {renderSnapshotList()}
        </Table.Body>
      </Table>
      {renderLoadingAndError()}
    </div>
  )
}

export default Snapshots
