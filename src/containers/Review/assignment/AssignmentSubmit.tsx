import React from 'react'
import { Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import useUpdateAssignment from '../../../utils/hooks/useUpdateAssignment'

interface AssignmentSubmitProps {
  fullStructure: FullStructure
  assignedSections: SectionAssignee
  assignmentsFiltered: AssignmentDetails[]
  enableSubmit: boolean
}

const AssignmentSubmit: React.FC<AssignmentSubmitProps> = ({
  fullStructure,
  assignedSections,
  assignmentsFiltered,
  enableSubmit,
}) => {
  const { strings } = useLanguageProvider()
  const { submitAssignments } = useUpdateAssignment({
    fullStructure,
    assignedSections,
    assignmentsFiltered,
  })

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        primary
        content={strings.BUTTON_SUBMIT}
        compact
        onClick={submitAssignments}
        disabled={!enableSubmit}
      />
    </div>
  )
}

export default AssignmentSubmit
