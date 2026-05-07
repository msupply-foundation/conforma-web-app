import { useState } from 'react'
import { ApplicationViewProps } from '../../types'
import { Button } from 'semantic-ui-react'
import PreviewModal from '../../../components/Review/DecisionPreview/PreviewModal'
import { useLanguageProvider } from '../../../contexts/Localisation'

interface Parameters {
  buttonText?: string
  headerText?: string
  previewText?: string
  preventDownload?: boolean
  applicationDataOverride?: { [key: string]: any }
}

export type PreviewButtonProps = Pick<ApplicationViewProps, 'parameters' | 'applicationData'>

export const PreviewButton = ({ parameters, applicationData }: PreviewButtonProps) => {
  const { getPluginTranslator } = useLanguageProvider()
  const t = getPluginTranslator('previewAction')

  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    buttonText = t('DEFAULT_BUTTON_TEXT'),
    headerText = t('DEFAULT_HEADER_TEXT'),
    previewText = t('DEFAULT_PREVIEW_TEXT'),
    applicationDataOverride = {},
    preventDownload = true,
  } = parameters as Parameters
  return (
    <>
      <PreviewModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        applicationId={applicationData?.id}
        applicationDataOverride={applicationDataOverride}
        headerText={headerText}
        previewText={previewText}
        preventDownload={preventDownload}
      />
      <Button primary onClick={() => setIsModalOpen(true)}>
        {buttonText}
      </Button>
    </>
  )
}

const ApplicationView = (props: ApplicationViewProps) => {
  return <PreviewButton {...props} />
}

export default ApplicationView
