import React from 'react'
import { Label } from 'semantic-ui-react'

const Stage: React.FC<{ name: string }> = ({ name }) => (
  // TODO: Issue #561 - Setup to use pre-defined colour of stage label
  <Label className="stage-label">{name}</Label>
)

export default Stage
