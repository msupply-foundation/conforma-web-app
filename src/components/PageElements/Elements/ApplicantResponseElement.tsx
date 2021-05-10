import React from 'react'
import { Grid, Icon, Label } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import strings from '../../../utils/constants'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ApplicationResponse } from '../../../utils/generated/graphql'
import { useRouter } from '../../../utils/hooks/useRouter'

interface ApplicantResponseElementProps {
  applicationResponse: ApplicationResponse
  canEdit: boolean
  linkToPage: string
  isResponseUpdated: boolean
  summaryViewProps: SummaryViewWrapperProps
}

const ApplicantResponseElement: React.FC<ApplicantResponseElementProps> = ({
  applicationResponse,
  canEdit,
  linkToPage,
  isResponseUpdated,
  summaryViewProps,
}) => {
  const { push } = useRouter()
  const backgroudColour = isResponseUpdated ? 'changable-background' : ''
  // TODO: Fix tiny margin showing on left and right on grid.item
  // TODO: Rename class className="review-comment-grid"
  return (
    <Grid columns="equal" className={`review-comment-grid ${backgroudColour}`}>
      <Grid.Column wodth={isResponseUpdated ? 4 : 14} textAlign="left">
        <SummaryViewWrapper {...summaryViewProps} />
      </Grid.Column>
      {isResponseUpdated && (
        <Grid.Column width={10} textAlign="left">
          <Icon name="circle" size="tiny" color="blue" />
          <Label className="simple-label">
            <strong>{strings.LABEL_UPDATED}</strong>
          </Label>
          <Label size="mini" className="simple-label shift-up-1">
            <strong>{getSimplifiedTimeDifference(applicationResponse.timeUpdated)}</strong>
          </Label>
        </Grid.Column>
      )}
      <Grid.Column width={2} textAlign="left" verticalAlign="middle">
        {canEdit && <UpdateIcon onClick={() => push(linkToPage)} />}
      </Grid.Column>
    </Grid>
  )
}

const UpdateIcon: React.FC<{ onClick: Function }> = ({ onClick }) => (
  <Icon className="clickable" name="pencil" size="large" color="blue" onClick={onClick} />
)

export default ApplicantResponseElement
