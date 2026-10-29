import { createContext, useContext } from 'react'
import { FullStructure } from '../utils/types'

// The structure of the application being filled in, for form elements that
// act on questions other than their own (e.g. aiDocumentFill). Provided by the
// applicant's form pages and by the Template Builder's form view, which works
// on the template's config application.
interface ApplicationStructureState {
  structure: FullStructure
}

const ApplicationStructureContext = createContext<ApplicationStructureState | undefined>(undefined)

export const ApplicationStructureProvider = ApplicationStructureContext.Provider

export const useApplicationStructure = () => useContext(ApplicationStructureContext)
