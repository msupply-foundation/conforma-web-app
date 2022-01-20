import React from 'react'
import { Route, Switch } from 'react-router'
import { Container, Message, Tab, Label, Icon, Header } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import useGetReviewInfo from '../../utils/hooks/useGetReviewInfo'
import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { FullStructure } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import ReviewPageWrapper from './ReviewPageWrapper'
import AssignmentWrapper from './assignment/AssignmentWrapper'

interface ReviewWrapperProps {
  structure: FullStructure
}

const ReviewWrapper: React.FC<ReviewWrapperProps> = ({ structure }) => {
  const { strings } = useLanguageProvider()
  const {
    match: { path },
  } = useRouter()
  const { error, fullStructure } = useGetApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
  })

  usePageTitle(strings.PAGE_TITLE_REVIEW.replace('%1', structure.info.serial))

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!fullStructure) return <Loading />

  const {
    info: { template, org, name },
  } = fullStructure

  const tabPanes = [
    { menuItem: 'Overview', render: () => <Tab.Pane>Overview</Tab.Pane> },
    {
      menuItem: 'Assignment',
      render: () => (
        <Tab.Pane>
          <AssignmentWrapper {...{ structure }} />
        </Tab.Pane>
      ),
    },
  ]

  return (
    <Container id="review-area">
      <Switch>
        <Route exact path={path}>
          <ReviewHomeHeader
            templateCode={template.code}
            applicationName={name}
            orgName={org?.name as string}
          />
          <Tab panes={tabPanes} />
        </Route>
        <Route exact path={`${path}/:reviewId`}>
          <ReviewPageWrapper {...{ structure }} />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </Container>
  )
}

interface ReviewHomeProps {
  templateCode: string
  applicationName: string
  orgName?: string
}

const ReviewHomeHeader: React.FC<ReviewHomeProps> = ({
  templateCode,
  applicationName,
  orgName,
}) => {
  const { push } = useRouter()
  return (
    <div id="review-home-header">
      <Label
        className="simple-label clickable"
        onClick={() => push(`/applications?type=${templateCode}`)}
        icon={<Icon name="chevron left" className="dark-grey" />}
      />
      <Header as="h3" content={applicationName} subheader={<Header as="h5" content={orgName} />} />
    </div>
  )
}

export default ReviewWrapper
