import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { LookupTableListPage, LookupTablePage } from '.'
import { useRouter } from '../../utils/hooks/useRouter'
import {
  LookUpTableImportCsvProvider,
  SingleTableStructureConsumer,
  SingleTableStructureProvider,
  AllTableStructuresConsumer,
  AllTableStructuresProvider,
} from '../contexts'

const LookupTableWrapper: React.FC = () => {
  const {
    match: { path },
    pathname,
  } = useRouter()

  return (
    <LookUpTableImportCsvProvider>
      <Switch>
        <Route exact path={[path, `${path}/import`]}>
          <AllTableStructuresProvider>
            <AllTableStructuresConsumer>
              {({ getAllTableStructures }) => {
                return (
                  <LookupTableListPage
                    onImportSuccess={() => getAllTableStructures()}
                    importModelOpen={pathname === `${path}/import`}
                  />
                )
              }}
            </AllTableStructuresConsumer>
          </AllTableStructuresProvider>
        </Route>
        <Route exact path={[`${path}/:lookupTableID`, `${path}/:lookupTableID/import`]}>
          <SingleTableStructureProvider>
            <SingleTableStructureConsumer>
              {({ getStructure, structure }) => (
                <LookupTablePage
                  onImportSuccess={() => getStructure()}
                  importModelOpen={/[d+\/import]$/.test(pathname)}
                  structure={structure}
                />
              )}
            </SingleTableStructureConsumer>
          </SingleTableStructureProvider>
        </Route>
      </Switch>
    </LookUpTableImportCsvProvider>
  )
}

export default LookupTableWrapper
