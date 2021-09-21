import React, { useState, useEffect, useRef } from 'react'
import { Button, Grid, Icon, Input, Label, Loader, Modal } from 'semantic-ui-react'
import config from '../../config'

const snapshotsBaseUrl = `${config.serverREST}/snapshot`
const snapshotListUrl = `${snapshotsBaseUrl}/list`
const takeSnapshotUrl = `${snapshotsBaseUrl}/take`
const useSnapshotUrl = `${snapshotsBaseUrl}/use`
const snapshotFilesUrl = `${snapshotsBaseUrl}/files`
const uploadSnapshotUrl = `${snapshotsBaseUrl}/upload`
// const diffSnapshotUrl = `${snapshotsBaseUrl}/diff`

const Snapshots: React.FC = () => {
  const [compareFrom, setCompareFrom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [snapshotError, setSnapshotError] = useState<{ message: string; error: string } | null>(
    null
  )

  const [data, setData] = useState<string[] | null>(null)

  useEffect(() => {
    setData(null)
    setCompareFrom('')
    setSnapshotError(null)
    getList()
  }, [])

  const getList = async () => {
    try {
      const snapshotListRaw = await fetch(snapshotListUrl, { method: 'GET' })
      const snapshotList: string[] = (await snapshotListRaw.json()).snapshotsNames

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
      const resultRaw = await fetch(`${takeSnapshotUrl}?name=${normaliseSnapshotName(name)}`, {
        method: 'POST',
      })
      const resultJson = await resultRaw.json()

      if (resultJson.success) return setIsLoading(false)

      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while taking snapshot', error })
    }
  }

  const useSnapshot = async (name: string) => {
    setIsLoading(true)
    try {
      const resultRaw = await fetch(`${useSnapshotUrl}?name=${name}`, {
        method: 'POST',
      })
      const resultJson = await resultRaw.json()

      if (resultJson.success) return setIsLoading(false)

      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while loading snapshot', error })
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

      const resultRaw = await fetch(`${uploadSnapshotUrl}?name=${snapshotName}`, {
        method: 'POST',
        body: data,
      })
      const resultJson = await resultRaw.json()

      if (resultJson.success) return setIsLoading(false)
      setSnapshotError(resultJson)
    } catch (error) {
      setSnapshotError({ message: 'Front end error while uploading snapshot', error })
    }
  }

  const renderSnapshotList = () => {
    // const compareLinkRef = useRef<HTMLAnchorElement>(null)
    if (!data) return null
    return (
      <>
        {data.map((snapshotName) => (
          <Grid.Row key={`app_menu_${snapshotName}`} style={{ paddingBottom: 0 }}>
            <Grid.Column width={3} textAlign="right">
              <Label>{snapshotName}</Label>
            </Grid.Column>

            {compareFrom === '' && (
              <>
                <Grid.Column>
                  <Icon
                    size="large"
                    className="clickable"
                    name="play circle"
                    onClick={() => useSnapshot(snapshotName)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Icon
                    size="large"
                    className="clickable"
                    name="record"
                    onClick={() => takeSnapshot(snapshotName)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <a href={`${snapshotFilesUrl}/${snapshotName}.zip`} target="_blank">
                    <Icon name="download" size="large" />
                  </a>
                </Grid.Column>
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
          </Grid.Row>
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
      <Grid.Row>
        <Grid.Column width={3}>
          <Input
            size="mini"
            onChange={(_, { value }) => setValue(value)}
            placeholder="New Snapshot"
          />
        </Grid.Column>
        <Grid.Column textAlign="left">
          <Icon
            size="large"
            className="clickable"
            name="record"
            onClick={() => takeSnapshot(value)}
          />
        </Grid.Column>
      </Grid.Row>
    )
  }

  const renderUploadSnapshot = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    if (compareFrom !== '') return null
    // />
    return (
      <Grid.Row>
        <Grid.Column width={3}>
          <Button size="mini" onClick={() => fileInputRef?.current?.click()}>
            Upload Snapshot {''}
            <Icon name="upload" />
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
        </Grid.Column>
      </Grid.Row>
    )
  }

  return (
    <div id="list-container" style={{ backgroundColor: 'white' }}>
      <Grid textAlign="center">
        {newSnapshot()}
        {renderUploadSnapshot()}
        {renderSnapshotList()}
      </Grid>
      {renderLoadingAndError()}
    </div>
  )
}

export default Snapshots
