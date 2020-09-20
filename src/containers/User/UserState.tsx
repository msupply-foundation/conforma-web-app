import React, { createContext, useContext, useReducer } from 'react';

type UserState = {
  /** The map user */
  user: any | null;
};

type UserActions =
  | {
      type: 'setCurrentUser'
      payload: {
        nextUser: any
      }
    }
  | {
      type: 'resetCurrentUser'
    }

type UserProviderProps = { children: React.ReactNode }

const reducer = (state: UserState, action: UserActions) => {
  switch (action.type) {
    case 'setCurrentUser':
      const { nextUser } = action.payload
      return {
        // if we had other state I would spread it here: ...state,
        user: nextUser
      };
    case 'resetCurrentUser':
      return {
        user: null
      };
    default:
      return state;
  }
}

const initialState: UserState = {
  user: null,
}

// By setting the typings here, we ensure we get intellisense in VS Code
const initialUserContext: { 
  userState: UserState
  setUserState: React.Dispatch<UserActions> 
} = {
  userState: initialState,
  // will update to the reducer we provide in MapProvider
  setUserState: () => {}
};

// No need to export this as we use it internally only
const UserContext = createContext(initialUserContext)

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // rename the useReducer result to something more useful
  const userState = state;
  const setUserState = dispatch;

  // pass the state and reducer to the context, dont forget to wrap the children
  return <UserContext.Provider value={{ userState, setUserState }}>{children}</UserContext.Provider>;
}

/**
 * To use and set the state of the user from anywhere in the app
 * - @returns an object with a reducer function `setUserState` and the `userState`
 */
export const useUserState = () => useContext(UserContext);