import React from 'react'
import { Label } from 'semantic-ui-react'

const Stage: React.FC<{ name: string; colour: string }> = ({ name, colour }) => (
  <Label className="stage-label" style={{ backgroundColor: colour }}>
    {name}
  </Label>
)

export default Stage
