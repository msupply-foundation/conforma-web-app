import React, { SyntheticEvent } from 'react'
import { Route, Switch } from 'react-router'
import { Container, Message, Tab, Label, Icon, Header, StrictTabProps } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { FullStructure } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import ReviewPageWrapper from './ReviewPageWrapper'
import { OverviewTab, AssignmentTab, SummaryTab, NotesTab, DocumentsTab, ReviewProgress } from './'

interface ReviewWrapperProps {
  structure: FullStructure
}

const tabIdentifiers = ['overview', 'assignment', 'summary', 'notes', 'documents']

const ReviewWrapper: React.FC<ReviewWrapperProps> = ({ structure }) => {
  const { strings } = useLanguageProvider()
  const {
    match: { path },
    query: { tab },
    updateQuery,
  } = useRouter()
  const { error, fullStructure } = useGetApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
    shouldGetDraftResponses: false,
  })

  usePageTitle(strings.PAGE_TITLE_REVIEW.replace('%1', structure.info.serial))

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!fullStructure) return <Loading />

  const {
    info: { template, org, name },
  } = fullStructure

  if (!tab) {
    updateQuery({ tab: tabIdentifiers[0] })
  }

  const getTabFromQuery = (tabQuery: string | undefined) => {
    const index = tabIdentifiers.findIndex((tabName) => tabName === tabQuery)
    return index === -1 ? 0 : index
  }

  const handleTabChange = (_: SyntheticEvent, data: StrictTabProps) => {
    updateQuery({ tab: tabIdentifiers[data.activeIndex as number] })
  }

  const tabPanes = [
    {
      menuItem: strings.REVIEW_TAB_OVERVIEW,
      render: () => (
        <Tab.Pane>
          <OverviewTab structure={structure} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: strings.REVIEW_TAB_ASSIGNMENT,
      render: () => (
        <Tab.Pane>
          <AssignmentTab structure={structure} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: strings.REVIEW_TAB_SUMMARY,
      render: () => (
        <Tab.Pane>
          <SummaryTab structure={structure} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: strings.REVIEW_TAB_NOTES,
      render: () => (
        <Tab.Pane>
          <NotesTab structure={structure} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: strings.REVIEW_TAB_DOCUMENTS,
      render: () => (
        <Tab.Pane>
          <DocumentsTab structure={structure} />
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
          <ReviewProgress structure={structure} />
          <Tab panes={tabPanes} onTabChange={handleTabChange} activeIndex={getTabFromQuery(tab)} />
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
