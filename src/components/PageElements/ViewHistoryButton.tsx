import React from 'react'
import { Label } from 'semantic-ui-react'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useRouter } from '../../utils/hooks/useRouter'

const ViewHistoryButton: React.FC<{ elementCode: string }> = ({ elementCode }) => {
  const { t } = useLanguageProvider()
  const { updateQuery } = useRouter()
  return (
    <div className="history-container">
      <Label
        className="link-label clickable"
        icon="history"
        size="large"
        content={t('BUTTON_VIEW_HISTORY')}
        onClick={() => updateQuery({ showHistory: elementCode })}
      />
    </div>
  )
}

export default ViewHistoryButton
