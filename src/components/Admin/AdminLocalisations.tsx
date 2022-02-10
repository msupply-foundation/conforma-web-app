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

  return (
    <div id="localisation-panel">
      <Header as="h1">Localisation</Header>
      <Header as="h4">Currently installed languages</Header>
      {installedLanguages.map((language) => (
        <LanguageRow language={language} />
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

const LanguageRow: React.FC<{ language: LanguageOption }> = ({ language }) => {
  return <div>{language.languageName}</div>
}
