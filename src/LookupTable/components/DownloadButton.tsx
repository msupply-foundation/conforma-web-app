import axios from 'axios'
import config from '../../config.json'
import React, { useState } from 'react'
import { Popup, Button, Icon, Message } from 'semantic-ui-react'

const DownloadButton = ({ id, open: openPopup = false, popUpContent: content = '' }: any) => {
  const [open, setOpen] = useState(openPopup)
  const [error, setError]: any = useState('')

  let timeout: any = null

  const handleOpen = () => {
    setOpen(true)

    timeout = setTimeout(() => {
      setOpen(false)
    }, 8000)
  }

  const handleClose = () => {
    setOpen(false)
    setError('')
    clearTimeout(timeout)
  }

  const downloadItem = async (event: any) => {
    event.stopPropagation()
    await axios
      .get(config.serverREST + `/lookup-table/export/${id}`)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'file.csv')
        document.body.appendChild(link)
        link.click()
      })
      .catch((error) => {
        setOpen(true)
        setError(error.message)
      })
  }

  return (
    <Popup
      open={open}
      content={
        error ? <Message negative header="Error trying to download" content={error} /> : content
      }
      onClose={handleClose}
      onOpen={handleOpen}
      on={error ? 'click' : 'hover'}
      trigger={
        <Button icon as="button" onClick={(e) => downloadItem(e)}>
          <Icon name="download" />
        </Button>
      }
    />
  )
}

export default DownloadButton
