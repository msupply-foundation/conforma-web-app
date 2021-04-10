import React, { CSSProperties } from 'react'
import { Grid, Icon, Label } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../../formElementPlugins/types'
import getSimplifiedTimeDifference from '../../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ApplicationResponse } from '../../../../utils/generated/graphql'
import { useRouter } from '../../../../utils/hooks/useRouter'

interface SummaryResponseChangedElementProps {
  canEdit: boolean
  linkToPage: string
  latestApplicationResponse: ApplicationResponse
  previousApplicationResponse: ApplicationResponse
  summaryProps: SummaryViewWrapperProps
}

const SummaryResponseChangedElement: React.FC<SummaryResponseChangedElementProps> = ({
  canEdit,
  linkToPage,
  latestApplicationResponse,
  summaryProps,
}) => {
  const { push } = useRouter()
  return (
    <Grid>
      <Grid.Column floated="left" width={4}>
        <SummaryViewWrapper {...summaryProps} />
      </Grid.Column>
      <Grid.Column width={4}>
        <Icon name="circle" size="tiny" color="blue" />
        <Label style={reviewStatusStyle}>Updated</Label>
        <Label style={datePaddingStyle} size="mini">
          {getSimplifiedTimeDifference(latestApplicationResponse.timeUpdated)}
        </Label>
      </Grid.Column>
      <Grid.Column floated="right" textAlign="right" width={8}>
        {canEdit && <Icon name="edit" color="blue" size="small" onClick={() => push(linkToPage)} />}
      </Grid.Column>
    </Grid>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const reviewStatusStyle = {
  background: 'transparent',
  fontWeight: 'bolder',
  fontSize: 16,
  marginRight: 10,
}
const datePaddingStyle = { padding: 6 } as CSSProperties

export default SummaryResponseChangedElement
