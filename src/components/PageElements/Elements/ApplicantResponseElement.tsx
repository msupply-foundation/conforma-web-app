import React from 'react'
import { Grid, Icon, Label } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import strings from '../../../utils/constants'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ResponseElementProps } from '../../../utils/types'

type ApplicantResponseElementProps = ResponseElementProps & SummaryViewWrapperProps
const ApplicantResponseElement: React.FC<ApplicantResponseElementProps> = ({
  applicationResponse,
  isResponseUpdated = false,
  children,
  ...summaryViewProps
}) => {
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
        {children}
      </Grid.Column>
    </Grid>
  )
}

export default ApplicantResponseElement
