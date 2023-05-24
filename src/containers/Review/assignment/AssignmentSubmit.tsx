import React, { SetStateAction } from 'react'
import { Button } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignedSectionsByLevel, AssignmentDetails, FullStructure } from '../../../utils/types'
import useUpdateAssignment from '../../../utils/hooks/useUpdateAssignment'

interface AssignmentSubmitProps {
  fullStructure: FullStructure
  assignedSectionsByLevel: AssignedSectionsByLevel
  assignmentsFiltered: AssignmentDetails[]
  enableSubmit: boolean
  setAssignmentError: React.Dispatch<SetStateAction<string | null>>
}

const AssignmentSubmit: React.FC<AssignmentSubmitProps> = ({
  fullStructure,
  assignedSectionsByLevel,
  assignmentsFiltered,
  enableSubmit,
  setAssignmentError,
}) => {
  const { t } = useLanguageProvider()
  const { submitAssignments } = useUpdateAssignment({
    fullStructure,
  })

  const handleSubmit = async () => {
    try {
      for (const [level, assignedSections] of Object.entries(assignedSectionsByLevel)) {
        await submitAssignments(Number(level), assignedSections, assignmentsFiltered)
        fullStructure.reload()
      }
    } catch (err) {
      console.log(err)
      setAssignmentError(t('ASSIGNMENT_ERROR_GENERAL'))
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <Button
        primary
        content={t('BUTTON_SUBMIT')}
        compact
        onClick={handleSubmit}
        disabled={!enableSubmit}
      />
    </div>
  )
}

export default AssignmentSubmit
