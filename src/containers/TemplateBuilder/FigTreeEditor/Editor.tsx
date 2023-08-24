import React, { useState } from 'react'
import { FigTreeNode } from './FigTreeNode'
import { FigTreeProvider } from './FigTreeContext'

const EditorWIP: React.FC = () => {
  return (
    <div className="flex-column-center-start">
      <FigTreeProvider>
        <FigTreeNode path="" />
      </FigTreeProvider>
    </div>
  )
}

export default EditorWIP
