import React from 'react'
import { Route, Switch, useParams } from 'react-router-dom'
import { LookupTableListPage } from '.'
import { useRouter } from '../../utils/hooks/useRouter'
import LookupTablePage from './LookupTablePage'
import {
  LookUpTableImportCsvProvider,
  SingleTableStructureConsumer,
  SingleTableStructureProvider,
  TableStructuresConsumer,
  TableStructuresProvider,
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
          <TableStructuresProvider>
            <TableStructuresConsumer>
              {({ getTableStructures }) => {
                return (
                  <LookupTableListPage
                    onImportSuccess={() => getTableStructures()}
                    importModelOpen={pathname === `${path}/import`}
                  />
                )
              }}
            </TableStructuresConsumer>
          </TableStructuresProvider>
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
