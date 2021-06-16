import React from 'react'
import { Label } from 'semantic-ui-react'
import strings from '../../utils/constants'

const ViewHistoryButton: React.FC = () => {
  return (
    <div className="history-container">
      <Label class="clickable" icon="history" content={strings.BUTTON_VIEW_HISTORY} />
    </div>
  )
}

export default ViewHistoryButton
