import React, { useState } from 'react'
import { Button, Checkbox, Label, Loader, Modal, SemanticCOLORS, Table } from 'semantic-ui-react'
import { TranslatePluginMethod } from '../../../contexts/Localisation'
import { ExtractionAnswer, ExtractionElement, ExtractionValue } from './types'

export type FillState =
  | { status: 'reading' }
  | { status: 'error'; message: string }
  | {
      status: 'review'
      documents: string[]
      elements: ExtractionElement[]
      answers: Record<string, ExtractionAnswer>
    }

interface FillModalProps {
  state: FillState | null
  t: TranslatePluginMethod
  onApply: (codes: string[]) => void
  onClose: () => void
}

// Blocks the form while the documents are read, so no field changes before
// the answers are written, then shows the answers for the applicant to choose
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
          elements={state.elements}
          answers={state.answers}
          t={t}
          onApply={onApply}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}

const ReviewAnswers: React.FC<{
  elements: ExtractionElement[]
  answers: Record<string, ExtractionAnswer>
  t: TranslatePluginMethod
  onApply: (codes: string[]) => void
  onClose: () => void
}> = ({ elements, answers, t, onApply, onClose }) => {
  // In form order
  const answered = elements.filter(({ code }) => answers[code])

  // Existing answers are only replaced if the applicant chooses to
  const [selected, setSelected] = useState(
    () => new Set(answered.filter(({ currentValue }) => !currentValue).map(({ code }) => code))
  )

  const toggle = (code: string) =>
    setSelected((previous) => {
      const next = new Set(previous)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })

  if (answered.length === 0)
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
            {answered.map(({ code, title, currentValue }) => {
              const { value, confidence, evidence } = answers[code]
              const [confidenceKey, colour] = getConfidenceLevel(confidence)
              return (
                <Table.Row key={code}>
                  <Table.Cell collapsing>
                    <Checkbox checked={selected.has(code)} onChange={() => toggle(code)} />
                  </Table.Cell>
                  <Table.Cell>{title}</Table.Cell>
                  <Table.Cell>{currentValue}</Table.Cell>
                  <Table.Cell>
                    {formatValue(value)}
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
        <Button primary disabled={selected.size === 0} onClick={() => onApply([...selected])}>
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

const formatValue = (value: ExtractionValue) =>
  Array.isArray(value) ? value.join(', ') : String(value)
