import React, { useReducer } from 'react'
import { LookUpTableListType, LookUpTableUploadModalReducer } from './reducer'

const initialState: LookUpTableListType = {
  uploadModalOpen: false,
  file: null,
  tableName: '',
}

const LookUpTableContext = React.createContext<{
  state: LookUpTableListType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})

const LookUpTableListProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(LookUpTableUploadModalReducer, initialState)

  return (
    <LookUpTableContext.Provider value={{ state, dispatch }}>
      {children}
    </LookUpTableContext.Provider>
  )
}

export { LookUpTableContext, LookUpTableListProvider }
