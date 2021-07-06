import React from 'react'
import { Button, Header, Modal, Segment } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import useGetQuestionReviewHistory from '../../utils/hooks/useGetQuestionReviewHistory'
import HistoryResponseElement from '../PageElements/Elements/HistoryResponseElement'
import { useUserState } from '../../contexts/UserState'
import strings from '../../utils/constants'
import { StageDetails } from 'utils/types'

interface HistoryPanelProps {
  templateCode: string
  // userLevel?: number
  stages: StageDetails[]
  isApplicant?: boolean
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  templateCode,
  // userLevel = 1,
  isApplicant = false,
}) => {
  const {
    userState: { currentUser },
  } = useUserState()
  const {
    query: { serialNumber, showHistory },
    updateQuery,
  } = useRouter()

  const { historyList } = useGetQuestionReviewHistory({
    serial: serialNumber,
    questionCode: showHistory,
    templateCode,
    userId: currentUser?.userId || 0,
    // userLevel,
    isApplicant,
  })

  return (
    <Modal
      id="history-panel"
      closeIcon
      open={!!showHistory}
      onClose={() => updateQuery({ showHistory: null })}
    >
      <Modal.Header>{strings.TITLE_HISTORY_PANEL}</Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description>
          {Object.entries(historyList).map(([stage, historyElements]) => (
            <div>
              <Header content={stage} />
              {Object.values(historyElements).map((historyElement, index) => (
                <Segment basic className="summary-page-element-container" key={index}>
                  <div className="response-container">
                    <HistoryResponseElement {...historyElement} />
                  </div>
                </Segment>
              ))}
            </div>
          ))}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={() => updateQuery({ showHistory: null })}
          primary
          content={strings.BUTTON_BACK}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default HistoryPanel
