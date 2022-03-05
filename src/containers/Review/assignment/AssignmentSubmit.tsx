import React, { SetStateAction } from 'react'
import { Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import useUpdateAssignment from '../../../utils/hooks/useUpdateAssignment'

interface AssignmentSubmitProps {
  fullStructure: FullStructure
  assignedSections: SectionAssignee
  assignmentsFiltered: AssignmentDetails[]
  enableSubmit: boolean
  setAssignmentError: React.Dispatch<SetStateAction<string | null>>
}

const AssignmentSubmit: React.FC<AssignmentSubmitProps> = ({
  fullStructure,
  assignedSections,
  assignmentsFiltered,
  enableSubmit,
  setAssignmentError,
}) => {
  const { strings } = useLanguageProvider()
  const { submitAssignments } = useUpdateAssignment({
    fullStructure,
  })

  const handleSubmit = async () => {
    try {
      await submitAssignments(assignedSections, assignmentsFiltered)
    } catch (err) {
      console.log(err)
      setAssignmentError(strings.ASSIGNMENT_ERROR_GENERAL)
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        primary
        content={strings.BUTTON_SUBMIT}
        compact
        onClick={handleSubmit}
        disabled={!enableSubmit}
      />
    </div>
  )
}

export default AssignmentSubmit
