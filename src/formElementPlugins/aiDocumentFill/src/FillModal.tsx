import React, { useState } from 'react'
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
  | { status: 'review'; documents: string[]; proposals: Proposal[] }
  | { status: 'applying' }

interface FillModalProps {
  state: FillState | null
  t: TranslatePluginMethod
  onApply: (proposals: Proposal[]) => void
  onClose: () => void
}

// Blocks the form while the documents are read and the answers saved, so no
// field changes in between, and shows the answers for the applicant to choose
export const FillModal: React.FC<FillModalProps> = ({ state, t, onApply, onClose }) => {
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
        <ReviewAnswers proposals={state.proposals} t={t} onApply={onApply} onClose={onClose} />
      )}
    </Modal>
  )
}

const ReviewAnswers: React.FC<{
  proposals: Proposal[]
  t: TranslatePluginMethod
  onApply: (proposals: Proposal[]) => void
  onClose: () => void
}> = ({ proposals, t, onApply, onClose }) => {
  // Existing answers are only replaced if the applicant chooses to
  const [selected, setSelected] = useState(
    () => new Set(proposals.filter(({ target }) => !target.definition.currentValue))
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
              return (
                <Table.Row key={code}>
                  <Table.Cell collapsing>
                    <Checkbox checked={selected.has(proposal)} onChange={() => toggle(proposal)} />
                  </Table.Cell>
                  <Table.Cell>{title}</Table.Cell>
                  <Table.Cell>{currentValue}</Table.Cell>
                  <Table.Cell>
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
          disabled={selected.size === 0}
          // In form order
          onClick={() => onApply(proposals.filter((proposal) => selected.has(proposal)))}
        >
          {t('BUTTON_APPLY', { count: selected.size })}
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
