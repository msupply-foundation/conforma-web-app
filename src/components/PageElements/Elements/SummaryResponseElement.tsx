import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Grid } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import { SummaryViewWrapperProps } from '../../../formElementPlugins/types'
import { ApplicationResponse } from '../../../utils/generated/graphql'
import strings from '../../../utils/constants'

interface SummaryResponseElementProps {
  canEdit: boolean
  linkToPage: string
  latestApplicationResponse: ApplicationResponse
  previousApplicationResponse: ApplicationResponse
  summaryProps: SummaryViewWrapperProps
}

const SummaryResponseElement: React.FC<SummaryResponseElementProps> = ({
  canEdit,
  linkToPage,
  summaryProps,
}) => (
  <Grid>
    <Grid.Column width={14} textAlign="left">
      <SummaryViewWrapper {...summaryProps} />
    </Grid.Column>
    <Grid.Column width={2} textAlign="left" verticalAlign="middle">
      {canEdit && (
        <Link to={linkToPage}>
          <strong>{strings.BUTTON_SUMMARY_EDIT}</strong>
        </Link>
      )}
    </Grid.Column>
  </Grid>
)

export default SummaryResponseElement
