import React, { createContext, useContext, useEffect, useState } from 'react'
import { matchPath } from 'react-router'
import { Header, Message } from 'semantic-ui-react'
import { Loading, NoMatch } from '../../../components'
import strings from '../../../utils/constants'

import {
  FullTemplateFragment,
  GetFullTemplateInfoQuery,
  TemplateAction,
  TemplateCategory,
  TemplateElement,
  TemplateFilterJoin,
  TemplatePermission,
  TemplateSection,
  TemplateStage,
  TemplateStatus,
  useGetFullTemplateInfoQuery,
} from '../../../utils/generated/graphql'
import { useRouter } from '../../../utils/hooks/useRouter'
import OperationContext from '../shared/OperationContext'
import TextIO from '../shared/TextIO'
import Actions from './Actions/Actions'
import {
  CreateApplicationWrapper,
  ApplicationWrapper,
  FullAppllicationWrapper,
} from './ApplicationWrapper'

import Form from './Form/Form'
import FormWrapper from './Form/FormWrapper'
import General from './General/General'
import Permissions from './Permissions/Permissions'

export type TemplateInfo = GetFullTemplateInfoQuery['template']

const tabs = [
  {
    route: 'general',
    title: 'General',
    render: () => <General />,
  },
  {
    route: 'form',
    title: 'Form',
    render: () => <Form />,
  },
  {
    route: 'permissions',
    title: 'Permissions',
    render: () => <Permissions />,
  },
  {
    route: 'actions',
    title: 'Actions',
    render: () => <Actions />,
  },
]

export const disabledMessage = 'Can only edit draft procedure, please make it draft or duplicate'

const TemplateContainer: React.FC = () => {
  const {
    match: { path },
    push,
    location,
  } = useRouter()
  const {
    template: { version, name, code, status, applicationCount, id },
  } = useTemplateState()

  const selected = tabs.find(({ route }) =>
    matchPath(location.pathname, { path: `${path}/${route}`, exact: true, strict: false })
  )

  if (!selected) return <NoMatch />

  return (
    <div className="template-builder-wrapper">
      <div className="template-builder-info-bar">
        <TextIO title="version" text={String(version)} />
        <TextIO title="name" text={name} />
        <TextIO title="code" text={code} />
        <TextIO title="status" text={status} />
        <TextIO title="# applications" text={String(applicationCount)} />
      </div>
      <div className="template-builder-tabs">
        {tabs.map(({ route, title }) => (
          <div
            key={title}
            onClick={() => push(`/admin/template/${id}/${route}`)}
            className={selected.route === route ? 'builder-selected ' : ''}
          >
            <Header as="h4">{title}</Header>
          </div>
        ))}
      </div>
      {selected.render()}
    </div>
  )
}

type TemplateContextState = {
  template: {
    id: number
    isDraft: boolean
    version: number
    name: string
    code: string
    status: string
    applicationCount: number
  }
  refetch: () => void
  category?: TemplateCategory
  sections: TemplateSection[]
  templateFilterJoins: TemplateFilterJoin[]
  allElements: TemplateElement[]
  fromQuery?: FullTemplateFragment
  templatePermissions: TemplatePermission[]
  templateStages: TemplateStage[]
  actions: TemplateAction[]
}

const defaultTemplateContextState: TemplateContextState = {
  template: {
    id: 0,
    isDraft: false,
    version: 0,
    name: '',
    code: '',
    status: '',
    applicationCount: 0,
  },
  refetch: () => {},
  sections: [],
  allElements: [],
  templateFilterJoins: [],
  templatePermissions: [],
  templateStages: [],
  actions: [],
}

const Context = createContext<TemplateContextState>(defaultTemplateContextState)

const TemplateWrapper: React.FC = () => {
  const {
    query: { templateId },
  } = useRouter()

  const [state, setState] = useState<TemplateContextState>(defaultTemplateContextState)
  const [firstLoaded, setFirstLoaded] = useState(false)
  const { data, error, refetch } = useGetFullTemplateInfoQuery({
    fetchPolicy: 'network-only',
    variables: { id: Number(templateId) },
  })

  useEffect(() => {
    const template = data?.template
    const sections = (template?.templateSections?.nodes as TemplateSection[]) || []
    const allElements = sections
      .map((section) => (section.templateElementsBySectionId?.nodes as TemplateElement[]) || [])
      .flat()
    if (template) {
      setState({
        template: {
          id: template.id || 0,
          version: template?.version || 0,
          name: template?.name || '',
          code: template?.code || '',
          status: template?.status || TemplateStatus.Disabled,
          applicationCount: template?.applications?.totalCount || 0,
          isDraft: template.status === TemplateStatus.Draft,
        },
        category: (template?.templateCategory as TemplateCategory) || undefined,
        fromQuery: template,
        sections,
        allElements,
        refetch,
        templateFilterJoins: (template?.templateFilterJoins?.nodes || []) as TemplateFilterJoin[],
        templatePermissions: (template?.templatePermissions?.nodes || []) as TemplatePermission[],
        templateStages: (template?.templateStages?.nodes || []) as TemplateStage[],
        actions: (template?.templateActions?.nodes || []) as TemplateAction[],
      })
      setFirstLoaded(true)
    }
  }, [data])

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (!firstLoaded) return <Loading />
  return (
    <Context.Provider value={state}>
      <OperationContext>
        <FormWrapper>
          <CreateApplicationWrapper>
            <ApplicationWrapper>
              <FullAppllicationWrapper>
                <TemplateContainer />
              </FullAppllicationWrapper>
            </ApplicationWrapper>
          </CreateApplicationWrapper>
        </FormWrapper>
      </OperationContext>
    </Context.Provider>
  )
}

export const useTemplateState = () => useContext(Context)
export default TemplateWrapper
