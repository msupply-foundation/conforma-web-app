import React, { useState } from 'react'
import { Button, Header, Icon, Table } from 'semantic-ui-react'

import {
  TemplateStatus,
  useGetTemplatesAvailableForCodeQuery,
} from '../../../../utils/generated/graphql'
import { useLanguageProvider } from '../../../../contexts/Localisation'

import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import Markdown from '../../../../utils/helpers/semanticReactMarkdown'
import { useOperationState } from '../../shared/OperationContext'
import TextIO from '../../shared/TextIO'
import { useApplicationState } from '../ApplicationWrapper'
import { useTemplateState } from '../TemplateWrapper'
import Category from './Categories'
import Filters from './Filters'
import { IconButton } from '../../shared/IconButton'
import MessagesConfig from './MessagesConfig'
import CheckboxIO from '../../shared/CheckboxIO'
import config from '../../../../config'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import { getVersionString } from '../../Templates'
import { Template } from '../../useGetTemplates'

const General: React.FC = () => {
  const { t } = useLanguageProvider()
  const { updateTemplate } = useOperationState()
  const { structure } = useApplicationState()
  const { template } = useTemplateState()
  const { canEdit } = template
  const { refetch: refetchAvailable } = useGetTemplatesAvailableForCodeQuery({
    variables: { code: template.code },
  })
  const [isMessageConfigOpen, setIsMessageConfigOpen] = useState(false)

  const canSetAvailable = template.status !== TemplateStatus.Available

  const canSetDraft =
    canEdit &&
    (template.applicationCount === 0 ||
      // Let us make changes to active templates while in "dev" mode
      !config.isProductionBuild)

  const canSetDisabled = template.status !== TemplateStatus.Disabled

  return (
    <div className="flex-column-center-start">
      <div className="flex-row flex-gap-10">
        <ButtonWithFallback
          title={t('TEMPLATE_GEN_BUTTON_AVAILABLE')}
          disabledMessage={t('TEMPLATE_GEN_BUTTON_AVAILABLE_DISABLED')}
          disabled={!canSetAvailable}
          onClick={() => {
            updateTemplate(template, { status: TemplateStatus.Available })
          }}
        />
        <ButtonWithFallback
          title={t('TEMPLATE_GEN_BUTTON_DRAFT')}
          disabledMessage={t('TEMPLATE_GEN_BUTTON_DRAFT_DISABLED')}
          disabled={!canSetDraft}
          onClick={async () => {
            if (await updateTemplate(template, { status: TemplateStatus.Draft })) refetchAvailable()
          }}
        />
        <ButtonWithFallback
          title="Disable"
          disabledMessage="Already disabled"
          disabled={!canSetDisabled}
          onClick={async () => {
            if (await updateTemplate(template, { status: TemplateStatus.Disabled }))
              refetchAvailable()
          }}
        />
      </div>
      <div className="spacer-10" />
      <div className="longer">
        <TextIO
          text={String(template.name)}
          disabled={!canEdit}
          disabledMessage="Can only change name of draft template"
          title="Name"
          setText={(text) => updateTemplate(template, { name: text })}
          minLabelWidth={100}
          labelTextAlign="right"
        />
      </div>
      <div className="longer">
        <TextIO
          text={String(template.namePlural)}
          disabled={!canEdit}
          disabledMessage="Can only change name of draft template"
          title="Name Plural"
          setText={(text) => updateTemplate(template, { namePlural: text })}
          minLabelWidth={100}
          labelTextAlign="right"
        />
      </div>
      <TextIO
        text={String(template.code)}
        disabled={!canEdit}
        disabledMessage="Can only change code of draft template"
        title="Code"
        setText={(text) => updateTemplate(template, { code: text })}
        minLabelWidth={100}
        labelTextAlign="right"
      />
      <div className="flex-row-start-center">
        <TextIO
          text={String(template.serialPattern)}
          disabled={!canEdit}
          disabledMessage="Can only change serial pattern of draft template"
          title="Serial Pattern"
          setText={(text) => updateTemplate(template, { serialPattern: text })}
          minLabelWidth={100}
          labelTextAlign="right"
        />
        <Link
          to={{
            pathname:
              'https://github.com/openmsupply/conforma-server/wiki/List-of-Action-plugins#generate-text-string',
          }}
          target="_blank"
        >
          <Icon name="help circle" color="grey" />
        </Link>
      </div>
      <CheckboxIO
        title="Linear"
        value={!!template?.isLinear}
        setValue={(checked) => {
          updateTemplate(template, { isLinear: checked })
        }}
        disabled={!canEdit}
        disabledMessage="Can only change isLinear of draft template"
        minLabelWidth={100}
        labelTextAlign="right"
      />

      <CheckboxIO
        title="Interactive"
        value={!!template?.canApplicantMakeChanges}
        setValue={(checked) => {
          updateTemplate(template, { canApplicantMakeChanges: checked })
        }}
        disabled={!canEdit}
        disabledMessage="Can only change canApplicantMakeChanges of draft template"
        minLabelWidth={100}
        labelTextAlign="right"
      />

      <Category />

      <Filters />

      {/* MESSAGES */}
      <div className="spacer-20" />
      <div className="flex-row-start-center">
        <Header className="no-margin-no-padding" as="h3">
          Messages
        </Header>
        {canEdit && <IconButton name="setting" onClick={() => setIsMessageConfigOpen(true)} />}
      </div>
      <div className="flex-column-center full-width-container">
        <div className="spacer-20" />
        <Header className="no-margin-no-padding" as="h4">
          Start Message
        </Header>
        <div className="config-container-alternate text-block-width">
          <Markdown text={structure.info.startMessage || ''} />
        </div>
      </div>
      <div className="flex-column-center full-width-container">
        <div className="spacer-20" />
        <Header className="no-margin-no-padding" as="h4">
          Submission Message
        </Header>
        <div className="config-container-alternate text-block-width">
          <Markdown text={structure.info.submissionMessage || ''} />
        </div>
      </div>
      <MessagesConfig isOpen={isMessageConfigOpen} onClose={() => setIsMessageConfigOpen(false)} />

      {/* VERSION HISTORY */}
      <div className="spacer-20" />
      <div className="spacer-20" />
      <Header className="no-margin-no-padding" as="h3">
        Version History
      </Header>
      <Table stackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="num" width={1}>
              No.
            </Table.HeaderCell>
            <Table.HeaderCell key="timestamp" width={4}>
              Timestamp
            </Table.HeaderCell>
            <Table.HeaderCell key="versionId" width={3}>
              Version ID
            </Table.HeaderCell>
            <Table.HeaderCell key="comment">Comment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {template.canEdit && (
            <Table.Row>
              <Table.Cell>{template.versionHistory.length + 1}</Table.Cell>
              <Table.Cell>
                {template.versionTimestamp.toLocaleString(DateTime.DATETIME_MED)}
              </Table.Cell>
              <Table.Cell>
                <em>{getVersionString(template, false)}</em>
              </Table.Cell>
              <Table.Cell>
                <div className="flex-row-space-between-center">
                  <em>Not yet committed or exported</em>
                  <Button primary>Commit now</Button>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
          {template.versionHistory.map((version) => (
            <Table.Row key={version.versionId}>
              <Table.Cell>{version.number}</Table.Cell>
              <Table.Cell>
                {DateTime.fromISO(version.timestamp).toLocaleString(DateTime.DATETIME_MED)}
              </Table.Cell>
              <Table.Cell>{version.versionId}</Table.Cell>
              <Table.Cell>{version.comment}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default General
