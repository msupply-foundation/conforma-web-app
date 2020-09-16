import React, { createContext, Dispatch, useContext, useReducer } from 'react'

type ActionType = 'USER_UPDATE' | 'COMPANY_UPDATE'

interface Action {
  type: ActionType
  payload: object
}

type Dispatch = (action: Action) => void

type Company = {
  ID: number | undefined
  name: string
}

type State = {
  userName: string
  currentCompany: Company
}

type UserProviderProps = { children: React.ReactNode }

const initialState: State = {
  userName: '',
  currentCompany: {
    ID: undefined,
    name: '',
  },
}

const UserStateContext = createContext<State | undefined>(undefined)
const UserDispatchContext = createContext<Dispatch | undefined>(undefined)

const userReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'USER_UPDATE': {
      const { userName } = action.payload
      return { ...state, userName: userName }
    }
    case 'COMPANY_UPDATE': {
      const { companyID, companyName } = action.payload
      return { ...state, currentCompany: { ID: companyID, name: companyName } }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState)

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
    </UserStateContext.Provider>
  )
}

const useUserState = () => {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserProvider')
  }
  return context
}

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext)
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider')
  }
  return context
}

export { UserProvider, useUserState, useUserDispatch }
