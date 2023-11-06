import React, { SyntheticEvent, useState } from 'react'
import { Route, Switch } from 'react-router'
import { Container, Message, Tab, Label, Icon, Header, StrictTabProps } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../components'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { FullStructure } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import ReviewPageWrapper from './ReviewPageWrapper'
import { OverviewTab, AssignmentTab, NotesTab, DocumentsTab, ReviewProgress } from './'
import { NotesState } from './notes/NotesTab'
import { useViewport } from '../../contexts/ViewportState'

interface ReviewWrapperProps {
  structure: FullStructure
}

const tabIdentifiers = ['overview', 'assignment', 'notes', 'documents']

const ReviewWrapper: React.FC<ReviewWrapperProps> = ({ structure }) => {
  const { t } = useLanguageProvider()
  const { isMobile } = useViewport()
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

  // State values for NOTES tab, need to instantiate here to preserve state
  // between tab switches:
  const [notesState, setNotesState] = useState<NotesState>({
    sortDesc: true,
    filesOnlyFilter: false,
    showForm: false,
    files: [],
    comment: '',
  })

  usePageTitle(t('PAGE_TITLE_REVIEW', structure.info.serial))

  if (error) return <Message error title={t('ERROR_GENERIC')} list={[error]} />

  if (!fullStructure) return <Loading />

  const {
    info: { template, org, name },
  } = fullStructure

  const getTabFromQuery = (tabQuery: string | undefined) => {
    const index = tabIdentifiers.findIndex((tabName) => tabName === tabQuery)
    return index === -1 ? 0 : index
  }

  const handleTabChange = (_: SyntheticEvent, data: StrictTabProps) => {
    updateQuery({ tab: tabIdentifiers[data.activeIndex as number] })
  }

  const tabPanes = [
    {
      menuItem: t('REVIEW_TAB_OVERVIEW'),
      render: () => (
        <Tab.Pane>
          <OverviewTab structure={fullStructure} isActive={getTabFromQuery(tab) === 0} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('REVIEW_TAB_ASSIGNMENT'),
      render: () => (
        <Tab.Pane>
          <AssignmentTab fullApplicationStructure={fullStructure} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('REVIEW_TAB_NOTES'),
      render: () => (
        <Tab.Pane>
          <NotesTab structure={fullStructure} state={notesState} setState={setNotesState} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('REVIEW_TAB_DOCUMENTS'),
      render: () => (
        <Tab.Pane>
          <DocumentsTab structure={fullStructure} />
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
          <div id="review-home-content">
            {!isMobile && <ReviewProgress structure={structure} />}
            <div id="review-tabs">
              <Tab
                panes={tabPanes}
                onTabChange={handleTabChange}
                activeIndex={getTabFromQuery(tab)}
              />
            </div>
          </div>
        </Route>
        <Route exact path={`${path}/:reviewId`}>
          <ReviewPageWrapper {...{ structure: fullStructure }} />
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
  const {
    push,
    query: { tab },
    updateQuery,
    location,
  } = useRouter()

  // Need to store in useState, else location.state is lost on subsequent
  // re-renders
  const [prevQueryString] = useState(location?.state?.prevQuery)

  if (!tab) {
    updateQuery({ tab: tabIdentifiers[0] })
  }

  const linkBack = prevQueryString
    ? `/applications${prevQueryString}`
    : `/applications?type=${templateCode}`

  return (
    <div id="review-home-header">
      <Label
        className="simple-label clickable"
        onClick={() => push(linkBack)}
        icon={<Icon name="chevron left" className="dark-grey" />}
      />
      <Header as="h3" content={applicationName} subheader={orgName} />
    </div>
  )
}

export default ReviewWrapper
