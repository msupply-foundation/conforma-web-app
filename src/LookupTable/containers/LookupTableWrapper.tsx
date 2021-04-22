import React from 'react'
import { matchPath, Route, Switch, useHistory, useParams } from 'react-router-dom'
import { LookupTableListPage, LookupTablePage } from '.'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  LookUpTableImportCsvProvider,
  SingleTableStructureConsumer,
  SingleTableStructureProvider,
} from '../contexts'

const LookupTableWrapper: React.FC = () => {
  const router = useRouter()
  const {
    match: { path },
    pathname,
  } = router

  const history = useHistory()

  return (
    <LookUpTableImportCsvProvider>
      <Switch>
        <Route exact path={[path, `${path}/import`]}>
          <LookupTableListPage basePath={path} />
        </Route>
        <Route exact path={[`${path}/:lookupTableID`, `${path}/:lookupTableID/import`]}>
          <SingleTableStructureProvider>
            <SingleTableStructureConsumer>
              {({ getStructure, structure }) => {
                const match: any = matchPath(pathname, {
                  path: `${path}/:lookupTableID/import`,
                  exact: true,
                  strict: false,
                })

                return (
                  <LookupTablePage
                    importModalProps={{
                      open: match,
                      onSuccess: getStructure,
                      onClose: () => {
                        match && history.replace(`${path}/${match.params.lookupTableID}`)
                      },
                    }}
                    structure={structure}
                  />
                )
              }}
            </SingleTableStructureConsumer>
          </SingleTableStructureProvider>
        </Route>
      </Switch>
    </LookUpTableImportCsvProvider>
  )
}

export default LookupTableWrapper
