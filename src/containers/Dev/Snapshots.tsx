import React, { useState, useEffect, useRef } from 'react'
import { Button, Icon, Input, Label, Loader, Modal, Table, Header } from 'semantic-ui-react'
import config from '../../config'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'

const baseEndpoint = `${config.serverREST}/admin/snapshot`
const snapshotListUrl = `${baseEndpoint}/list`
const takeSnapshotUrl = `${baseEndpoint}/take`
const useSnapshotUrl = `${baseEndpoint}/use`
const snapshotFilesUrl = `${baseEndpoint}/files`
const uploadSnapshotUrl = `${baseEndpoint}/upload`
const deleteSnapshotUrl = `${baseEndpoint}/delete`
// const diffSnapshotUrl = `${snapshotsBaseUrl}/diff`

const Snapshots: React.FC = () => {
  const [compareFrom, setCompareFrom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )

  const [data, setData] = useState<string[] | null>(null)

  const JWT = localStorage.getItem(config.localStorageJWTKey)

  useEffect(() => {
    setData(null)
    setCompareFrom('')
    setSnapshotError(null)
    getList()
  }, [])

  const getList = async () => {
    try {
      const snapshotListRaw = await getRequest(snapshotListUrl)
      const snapshotList: string[] = snapshotListRaw.snapshotsNames

      setData(snapshotList)
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
        url: `${takeSnapshotUrl}?name=${normaliseSnapshotName(name)}`,
        headers: { Authorization: `Bearer ${JWT}` },
      })

      if (resultJson.success) {
        await getList()
        setIsLoading(false)
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
        url: `${useSnapshotUrl}?name=${name}`,
        headers: { Authorization: `Bearer ${JWT}` },
      })

      if (resultJson.success) return setIsLoading(false)

      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while loading snapshot', error })
    }
  }

  const deleteSnapshot = async (name: string) => {
    setIsLoading(true)
    try {
      const resultJson = await postRequest({
        url: `${deleteSnapshotUrl}?name=${name}`,
        headers: { Authorization: `Bearer ${JWT}` },
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
        url: `${uploadSnapshotUrl}?name=${snapshotName}`,
        headers: { Authorization: `Bearer ${JWT}` },
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
    const res = await fetch(`${snapshotFilesUrl}/${snapshotName}.zip`, {
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
        {data.map((snapshotName) => (
          <Table.Row key={`app_menu_${snapshotName}`} style={{ paddingBottom: 0 }}>
            <Table.Cell textAlign="right">
              <p>{snapshotName}</p>
            </Table.Cell>
            {compareFrom === '' && (
              <>
                <Table.Cell>
                  <Icon
                    size="large"
                    className="clickable"
                    name="play circle"
                    onClick={() => useSnapshot(snapshotName)}
                  />
                </Table.Cell>
                <Table.Cell width={1}>
                  <Icon
                    size="large"
                    className="clickable"
                    name="record"
                    onClick={() => takeSnapshot(snapshotName)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Icon
                    name="download"
                    size="large"
                    className="clickable blue"
                    onClick={() => downloadSnapshot(snapshotName)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="left">
                  <Icon
                    size="large"
                    className="clickable"
                    name="trash alternate"
                    onClick={() => deleteSnapshot(snapshotName)}
                  />
                </Table.Cell>
                {/* <Icon
                    className="clickable"
                    size="big"
                    name="random"
                    onClick={() => setCompareFrom(snapshotName)}
                  /> */}
              </>
            )}
            {/* {compareFrom !== snapshotName && compareFrom !== '' ? (
                <>
                  <a
                    ref={compareLinkRef}
                    href={`${diffSnapshotUrl}?from=${compareFrom}&to=${snapshotName}`}
                    target="_blank"
                    hidden
                  ></a>
                  <Icon
                    className="clickable"
                    name="random"
                    onClick={() => {
                      setIsOpen(false)
                      compareLinkRef?.current?.click()
                    }}
                  />
                </>
              ) : null} */}
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
