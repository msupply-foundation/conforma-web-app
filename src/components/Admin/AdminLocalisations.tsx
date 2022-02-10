import React, { useEffect, useState } from 'react'
import { Header, Button, Checkbox } from 'semantic-ui-react'
import { getRequest } from '../../utils/helpers/fetchMethods'
import config from '../../config'
import { LanguageOption, useLanguageProvider } from '../../contexts/Localisation'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { exportLanguages } from '../../utils/localisation/exportLanguages'

export const AdminLocalisations: React.FC = () => {
  const { strings } = useLanguageProvider()
  usePageTitle(strings.PAGE_TITLE_LOCALISATION)
  const [exportDisabled, setExportDisabled] = useState(true)
  const [installedLanguages, setInstalledLanguages] = useState<LanguageOption[]>([])

  useEffect(() => {
    getRequest(`${config.serverREST}/public/get-prefs`).then((prefs) =>
      setInstalledLanguages(prefs.languageOptions)
    )
  }, [])

  useEffect(() => {
    if (installedLanguages.length === 0) return
    // To-do: update on server
    console.log('TO-DO: Updating...')
  }, [installedLanguages])

  const handleSelect = (language: LanguageOption, index: number) => {
    const enabled = language.enabled
    const newLanguages = [...installedLanguages]
    newLanguages[index] = { ...language, enabled: !enabled }
    setInstalledLanguages(newLanguages)
  }

  return (
    <div id="localisation-panel">
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
      <Header as="h3">Export language files as spreadsheet:</Header>
      <div className="flex-row-center-center" style={{ gap: 20 }}>
        <Button primary content="Export" onClick={() => exportLanguages(exportDisabled)} />
        <Checkbox
          checked={exportDisabled}
          onChange={() => setExportDisabled(!exportDisabled)}
          label="Include disabled languages"
        />
      </div>
      <Header as="h3">Import language files:</Header>
      <Button primary content="Import" onClick={() => alert('Not implemented')} />
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
