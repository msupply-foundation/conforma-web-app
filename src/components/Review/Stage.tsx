import React from 'react'
import { Label } from 'semantic-ui-react'

const Stage: React.FC<{ name: string }> = ({ name }) => (
  // TODO: Issue #561 - Setup to use pre-defined colour of stage label
  <Label style={tempStageStyle(name)}>{name}</Label>
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const tempStageStyle = (stage: string) => {
  return stage === 'Assessment'
    ? {
        color: 'white',
        background: 'rgb(86, 180, 219)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.81px',
      }
    : {
        color: 'white',
        background: 'rgb(225, 126, 72)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.81px',
      }
}

export default Stage
