import React from 'react'
import { Form, Header, Modal, Segment } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import useGetQuestionHistory from '../../utils/hooks/useGetQuestionHistory'
import HistoryResponseElement from '../PageElements/Elements/HistoryResponseElement'
interface HistoryPanelProps {
  templateCode: string
  userId: number
  userLevel?: number
  isApplicant?: boolean
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  templateCode,
  userId,
  userLevel = 1,
  isApplicant = false,
}) => {
  const {
    query: { serialNumber, showHistory },
    updateQuery,
  } = useRouter()

  const { historyList } = useGetQuestionHistory({
    serial: serialNumber,
    questionCode: showHistory,
    templateCode,
    userId,
    userLevel,
    isApplicant,
  })

  return (
    <Modal
      className="history-panel"
      closeIcon
      open={!!showHistory}
      onClose={() => updateQuery({ showHistory: null })}
    >
      {historyList.map((historyElement, index) => (
        <Segment basic className="summary-page-element-container">
          <div className="response-container" key={index}>
            <HistoryResponseElement {...historyElement} />
          </div>
        </Segment>
      ))}
    </Modal>
  )
}

export default HistoryPanel
