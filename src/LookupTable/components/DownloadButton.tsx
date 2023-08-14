import axios from 'axios'
import config from '../../config'
import React, { Fragment, useState } from 'react'
import { Popup, Button, Icon, Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { DateTime } from 'luxon'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'

const DownloadButton = ({
  id,
  open: openPopup = false,
  popUpContent = '',
  content = '',
  name = 'lookup_table',
  ...props
}: any) => {
  const { t } = useLanguageProvider()
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

  const JWT = localStorage.getItem(config.localStorageJWTKey || '')
  const authHeader = JWT ? { Authorization: 'Bearer ' + JWT } : undefined

  const downloadItem = async (event: any) => {
    event.stopPropagation()
    await axios
      .get(getServerUrl('lookupTable', { action: 'export', id }), {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader,
        },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${name}_${DateTime.now().toISODate()}.csv`)
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
        error ? (
          <Message negative header={t('LABEL_FILE_DOWNLOAD_ERROR')} content={error} />
        ) : (
          popUpContent
        )
      }
      onClose={handleClose}
      onOpen={handleOpen}
      on={error ? 'click' : 'hover'}
      trigger={
        <Button
          icon
          as="button"
          color="orange"
          content={
            <Fragment>
              <Icon name="download" />
              {content}
            </Fragment>
          }
          onClick={(e) => downloadItem(e)}
          {...props}
        />
      }
    />
  )
}

export default DownloadButton
