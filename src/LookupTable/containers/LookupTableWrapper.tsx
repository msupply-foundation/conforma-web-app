import React from 'react'
import { Route, Switch } from 'react-router-dom'
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
  } = useRouter()

  return (
    <LookUpTableImportCsvProvider>
      <Switch>
        <Route exact path={path}>
          <TableStructuresProvider>
            <TableStructuresConsumer>
              {({ getTableStructures, state }) => (
                <LookupTableListPage onImportSuccess={() => getTableStructures()} />
              )}
            </TableStructuresConsumer>
          </TableStructuresProvider>
        </Route>
        <Route exact path={`${path}/:lookupTableID`}>
          <SingleTableStructureProvider>
            <SingleTableStructureConsumer>
              {({ getSingleTableStructure, state }) => (
                <LookupTablePage onImportSuccess={() => getSingleTableStructure()} />
              )}
            </SingleTableStructureConsumer>
          </SingleTableStructureProvider>
        </Route>
      </Switch>
    </LookUpTableImportCsvProvider>
  )
}

export default LookupTableWrapper
