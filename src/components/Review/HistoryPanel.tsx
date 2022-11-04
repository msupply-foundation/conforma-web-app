import React from 'react'
import { Button, Modal, Segment, Form } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import useGetQuestionReviewHistory from '../../utils/hooks/useGetQuestionReviewHistory'
import HistoryResponseElement from '../PageElements/Elements/HistoryResponseElement'
import { useUserState } from '../../contexts/UserState'
import { Stage } from '../Review'
import { useLanguageProvider } from '../../contexts/Localisation'
import { StageDetails, TemplateDetails } from '../../utils/types'

interface HistoryPanelProps {
  template: TemplateDetails
  stages: StageDetails[]
  isApplicant?: boolean
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ template, stages, isApplicant = false }) => {
  const { strings } = useLanguageProvider()
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
    templateCode: template.code,
    templateVersion: template.version,
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
          <Form>
            {historyList.map(({ stageNumber, historyElements }) => {
              const stageDetails = stages.find(({ number }) => number === stageNumber)
              const stageName = stageDetails?.name || strings.ERROR_STAGE_NOT_FOUND
              const stageColour = stageDetails?.colour || ''
              return (
                <div key={`history_stage_${stageName}`} className="history-block">
                  <div className="stage-label-spacing">
                    <Stage name={stageName} colour={stageColour} />
                  </div>
                  {historyElements.map((historyElement, index) => (
                    <Segment basic className="summary-page-element-container" key={index}>
                      <div className="response-container">
                        <HistoryResponseElement {...historyElement} />
                      </div>
                    </Segment>
                  ))}
                </div>
              )
            })}
          </Form>
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
