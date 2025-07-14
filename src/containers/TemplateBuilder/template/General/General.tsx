import React from 'react'
import { Icon } from 'semantic-ui-react'
import { TemplateStatus } from '../../../../utils/generated/graphql'
import { useLanguageProvider } from '../../../../contexts/Localisation'
import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import { useOperationState } from '../../shared/OperationContext'
import TextIO from '../../shared/TextIO'
import { useTemplateState } from '../TemplateWrapper'
import Category from './Categories'
import Filters from './Filters'
import CheckboxIO from '../../shared/CheckboxIO'
import config from '../../../../config'
import { Link } from 'react-router-dom'
import useConfirmationModal from '../../../../utils/hooks/useConfirmationModal'
import { isTemplateUnlocked } from '../helpers'
import NumberIO from '../../shared/NumberIO'
import { TemplateOperationsModal } from '../../templateOperations/TemplateOperationsModal'
import { DataViewSelector } from './DataViews/DataViews'
import { FileSelector } from './Files/Files'
import { FragmentSelector } from './Fragments/Fragments'
import { Messages } from './Messages'
import { VersionHistory } from './VersionHistory'

const General: React.FC = () => {
  const { t } = useLanguageProvider()
  const { updateTemplate, operationModalState } = useOperationState()
  const { template } = useTemplateState()
  const { canEdit, isDraft, applicationCount } = template
  const { ConfirmModal: MakeAvailableConfirm, showModal: confirmMakeAvailable } =
    useConfirmationModal({
      type: 'warning',
    })

  const canSetAvailable = template.status !== TemplateStatus.Available

  const canSetDraft =
    isTemplateUnlocked(template) &&
    !isDraft &&
    (applicationCount === 0 ||
      // Let us make changes to active templates while in "dev" mode
      !config.isProductionBuild)

  const canSetDisabled = template.status !== TemplateStatus.Disabled

  return (
    <div className="flex-column-center-start">
      <MakeAvailableConfirm />
      <TemplateOperationsModal {...operationModalState} />
      <div className="flex-row flex-gap-10">
        <ButtonWithFallback
          title={t('TEMPLATE_GEN_BUTTON_AVAILABLE')}
          disabledMessage={t('TEMPLATE_GEN_BUTTON_AVAILABLE_DISABLED')}
          disabled={!canSetAvailable}
          onClick={() => {
            if (isTemplateUnlocked(template))
              confirmMakeAvailable({
                title: 'Make template available?',
                message:
                  'This will enable a template version that has not yet been committed. This is allowed, but it is recommended that you commit first if you are about to enable it in a production environment.',
                onConfirm: () => updateTemplate(template, { status: TemplateStatus.Available }),
                confirmText: 'Make available now',
                cancelText: 'Go back and commit version',
              })
            else updateTemplate(template, { status: TemplateStatus.Available })
          }}
        />
        <ButtonWithFallback
          title={t('TEMPLATE_GEN_BUTTON_DRAFT')}
          disabledMessage={t('TEMPLATE_GEN_BUTTON_DRAFT_DISABLED')}
          disabled={!canSetDraft}
          onClick={async () => updateTemplate(template, { status: TemplateStatus.Draft })}
        />
        <ButtonWithFallback
          title="Disable"
          disabledMessage="Already disabled"
          disabled={!canSetDisabled}
          onClick={async () => updateTemplate(template, { status: TemplateStatus.Disabled })}
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
      <NumberIO
        title="Sort priority"
        number={template.priority}
        minLabelWidth={100}
        setNumber={(number) => updateTemplate(template, { priority: number })}
      />
      <Category />
      <Filters />
      <Messages />
      <FileSelector />
      <DataViewSelector />
      <FragmentSelector />
      <VersionHistory />
    </div>
  )
}

export default General
