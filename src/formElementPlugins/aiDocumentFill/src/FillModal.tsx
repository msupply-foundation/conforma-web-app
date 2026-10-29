import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Label, Loader, Modal, SemanticCOLORS, Table } from 'semantic-ui-react'
import { TranslatePluginMethod } from '../../../contexts/Localisation'
import { AiFillResponse } from '../../types'
import { FillTarget } from './buildElements'

// An answer from the documents, converted to the response its element saves
export interface Proposal {
  target: FillTarget
  response: AiFillResponse
  confidence: number
  evidence: string
}

export type FillState =
  | { status: 'reading' }
  | { status: 'error'; message: string }
  | {
      status: 'review'
      documents: string[]
      proposals: Proposal[]
      // Ticked to start with
      selected: Proposal[]
      // The proposals' questions that are visible with those applied
      visibleCodes: Set<string>
    }
  | { status: 'applying' }

// The questions that would be visible with these proposals applied
export type GetVisibleCodes = (selected: Proposal[]) => Promise<Set<string>>

interface FillModalProps {
  state: FillState | null
  t: TranslatePluginMethod
  getVisibleCodes: GetVisibleCodes
  onApply: (proposals: Proposal[]) => void
  onClose: () => void
}

// Blocks the form while the documents are read and the answers saved, so no
// field changes in between, and shows the answers for the applicant to choose
export const FillModal: React.FC<FillModalProps> = ({
  state,
  t,
  getVisibleCodes,
  onApply,
  onClose,
}) => {
  if (!state) return null

  return (
    <Modal open size={state.status === 'review' ? 'large' : 'tiny'} closeOnDimmerClick={false}>
      {state.status === 'reading' && (
        <Modal.Content>
          <Loader active inline="centered" size="large" content={t('READING_DOCUMENTS')} />
          <p style={{ textAlign: 'center', marginTop: 10 }}>{t('READING_TAKES_TIME')}</p>
        </Modal.Content>
      )}
      {state.status === 'applying' && (
        <Modal.Content>
          <Loader active inline="centered" size="large" content={t('APPLYING_ANSWERS')} />
        </Modal.Content>
      )}
      {state.status === 'error' && (
        <>
          <Modal.Content>
            <p>{state.message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={onClose}>{t('BUTTON_CLOSE')}</Button>
          </Modal.Actions>
        </>
      )}
      {state.status === 'review' && (
        <ReviewAnswers
          proposals={state.proposals}
          initialSelection={state.selected}
          initialVisibleCodes={state.visibleCodes}
          t={t}
          getVisibleCodes={getVisibleCodes}
          onApply={onApply}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

const ReviewAnswers: React.FC<{
  proposals: Proposal[]
  initialSelection: Proposal[]
  initialVisibleCodes: Set<string>
  t: TranslatePluginMethod
  getVisibleCodes: GetVisibleCodes
  onApply: (proposals: Proposal[]) => void
  onClose: () => void
}> = ({
  proposals,
  initialSelection,
  initialVisibleCodes,
  t,
  getVisibleCodes,
  onApply,
  onClose,
}) => {
  const [selected, setSelected] = useState(() => new Set(initialSelection))
  // A question that the ticked answers would leave hidden can't be filled.
  // It stays ticked or unticked, so it's back as it was if it applies again.
  const [visibleCodes, setVisibleCodes] = useState(initialVisibleCodes)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    let isCurrent = true
    setIsUpdating(true)
    getVisibleCodes(proposals.filter((proposal) => selected.has(proposal))).then((codes) => {
      if (!isCurrent) return
      setVisibleCodes(codes)
      setIsUpdating(false)
    })
    return () => {
      isCurrent = false
    }
  }, [selected, proposals, getVisibleCodes])

  // In form order
  const chosen = proposals.filter(
    (proposal) => selected.has(proposal) && visibleCodes.has(proposal.target.definition.code)
  )

  const toggle = (proposal: Proposal) =>
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(proposal)) next.delete(proposal)
      else next.add(proposal)
      return next
    })

  if (proposals.length === 0)
    return (
      <>
        <Modal.Header>{t('REVIEW_HEADER')}</Modal.Header>
        <Modal.Content>
          <p>{t('NO_ANSWERS_FOUND')}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>{t('BUTTON_CLOSE')}</Button>
        </Modal.Actions>
      </>
    )

  return (
    <>
      <Modal.Header>{t('REVIEW_HEADER')}</Modal.Header>
      <Modal.Content scrolling>
        <p>{t('REVIEW_INTRO')}</p>
        <Table celled stackable compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>{t('COLUMN_QUESTION')}</Table.HeaderCell>
              <Table.HeaderCell>{t('COLUMN_CURRENT')}</Table.HeaderCell>
              <Table.HeaderCell>{t('COLUMN_PROPOSED')}</Table.HeaderCell>
              <Table.HeaderCell>{t('COLUMN_CONFIDENCE')}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {proposals.map((proposal) => {
              const { target, response, confidence, evidence } = proposal
              const { code, title, currentValue } = target.definition
              const [confidenceKey, colour] = getConfidenceLevel(confidence)
              const isApplicable = visibleCodes.has(code)
              return (
                <Table.Row key={code} disabled={!isApplicable}>
                  <Table.Cell collapsing>
                    <Checkbox
                      checked={selected.has(proposal) && isApplicable}
                      disabled={!isApplicable}
                      onChange={() => toggle(proposal)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {title}
                    {!isApplicable && (
                      <p className="smaller-text" style={{ marginTop: 4 }}>
                        <em>{t('NOT_APPLICABLE')}</em>
                      </p>
                    )}
                  </Table.Cell>
                  {/* A list's text has a line per item */}
                  <Table.Cell style={{ whiteSpace: 'pre-line' }}>{currentValue}</Table.Cell>
                  <Table.Cell style={{ whiteSpace: 'pre-line' }}>
                    {response.text}
                    {evidence && (
                      <p className="smaller-text" style={{ marginTop: 4 }}>
                        <em>{evidence}</em>
                      </p>
                    )}
                  </Table.Cell>
                  <Table.Cell collapsing>
                    <Label color={colour} size="small">
                      {t(confidenceKey)}
                    </Label>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>{t('BUTTON_CANCEL')}</Button>
        <Button
          primary
          disabled={chosen.length === 0 || isUpdating}
          onClick={() => onApply(chosen)}
        >
          {t('BUTTON_APPLY', { count: chosen.length })}
        </Button>
      </Modal.Actions>
    </>
  )
}

const getConfidenceLevel = (confidence: number): [string, SemanticCOLORS] => {
  if (confidence >= 0.8) return ['CONFIDENCE_HIGH', 'green']
  if (confidence >= 0.5) return ['CONFIDENCE_MEDIUM', 'yellow']
  return ['CONFIDENCE_LOW', 'orange']
}
