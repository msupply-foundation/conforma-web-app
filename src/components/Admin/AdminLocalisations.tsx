import React, { useEffect, useState, useRef } from 'react'
import { Header, Button, Checkbox } from 'semantic-ui-react'
import { getRequest, postRequest } from '../../utils/helpers/fetchMethods'
import config from '../../config'
import { LanguageOption, useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import useToast from '../../utils/hooks/useToast'
import { exportLanguages } from '../../utils/localisation/exportLanguages'
import { importLanguages } from '../../utils/localisation/importLanguages'

export const AdminLocalisations: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_LOCALISATION)
  const fileInputRef = useRef<any>(null)
  const [exportDisabled, setExportDisabled] = useState(true)
  const [importDisabled, setImportDisabled] = useState(true)
  const [installedLanguages, setInstalledLanguages] = useState<LanguageOption[]>([])
  const [toastComponent, showToast] = useToast({ position: 'top-left' })

  useEffect(() => {
    getRequest(`${config.serverREST}/public/get-prefs`).then((prefs) =>
      setInstalledLanguages(prefs.languageOptions)
    )
  }, [])

  const handleSelect = async (language: LanguageOption, index: number) => {
    const enabled = language.enabled
    const currentLanguages = [...installedLanguages]
    const newLanguages = [...installedLanguages]
    const updatedLanguage = { ...language, enabled: !enabled }
    newLanguages[index] = updatedLanguage
    setInstalledLanguages(newLanguages)
    updateOnServer(updatedLanguage, currentLanguages)
  }

  const updateOnServer = async (
    updatedLanguage: LanguageOption,
    currentLanguages: LanguageOption[]
  ) => {
    const result = await postRequest({
      url: `${config.serverREST}/admin/enable-language?code=${updatedLanguage.code}&enabled=${updatedLanguage.enabled}`,
    })
    if (result.success) console.log('Language updated')
    else {
      // revert local state
      setInstalledLanguages(currentLanguages)
      showToast({ title: 'Error', text: result.message, style: 'error' })
      console.error(result.message)
    }
  }

  const handleFileImport = async (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      if (!event.target?.result) {
        showToast({ title: 'Error', text: 'Problem processing file', style: 'error' })
        return
      }
      importLanguages(event.target.result as string, importDisabled).then(
        ({ success, message }) => {
          if (success) {
            showToast({
              title: 'Languages successfully installed',
              style: 'success',
            })
            return
          } else {
            showToast({ title: 'Error', text: message, style: 'error' })
            return
          }
        }
      )
    }
    reader.readAsText(file)
  }

  return (
    <div id="localisation-panel">
      {toastComponent}
      <Header as="h1">Localisation</Header>
      <Header as="h4">Currently installed languages</Header>
      <div className="flex-row">
        <p className="smaller-text">Enabled</p>
      </div>
      {installedLanguages.map((language, index) => (
        <LanguageRow
          language={language}
          key={language.code}
          index={index}
          handleSelect={handleSelect}
        />
      ))}
      <Header as="h5">Export language files as spreadsheet (CSV):</Header>
      <div className="flex-row-start-center" style={{ gap: 20 }}>
        <Button primary content="Export" onClick={() => exportLanguages(exportDisabled)} />
        <Checkbox
          checked={exportDisabled}
          onChange={() => setExportDisabled(!exportDisabled)}
          label="Include disabled languages"
        />
      </div>
      <Header as="h5">Import language files:</Header>
      <div className="flex-row-start-center" style={{ gap: 20 }}>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          name="file-upload"
          multiple={false}
          accept=".csv"
          onChange={handleFileImport}
        />
        <Button primary content="Import" onClick={() => fileInputRef?.current?.click()} />
        <Checkbox
          checked={importDisabled}
          onChange={() => setImportDisabled(!importDisabled)}
          label="Include disabled languages"
        />
      </div>
    </div>
  )
}

const LanguageRow: React.FC<{
  language: LanguageOption
  handleSelect: (language: LanguageOption, index: number) => void
  index: number
}> = ({ language, handleSelect, index }) => {
  return (
    <div
      className="flex-row-start-center"
      style={{
        gap: 20,
        maxWidth: '80%',
        backgroundColor: 'white',
        marginBottom: 5,
        padding: 10,
        borderRadius: 8,
      }}
    >
      <Checkbox checked={language.enabled} onChange={() => handleSelect(language, index)} />
      <div className="flex-column">
        <p style={{ marginBottom: 0 }}>
          <strong>{language.languageName}</strong>
        </p>
        <p className="smaller-text">{language.description}</p>
      </div>
      <p style={{ fontSize: '2em', flexGrow: 1, textAlign: 'right' }}>{language.flag}</p>
    </div>
  )
}
