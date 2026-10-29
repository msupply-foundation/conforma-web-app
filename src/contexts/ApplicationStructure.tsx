import { createContext, useContext } from 'react'
import { FullStructure } from '../utils/types'

// The structure of the application being filled in, for form elements that
// act on questions other than their own (e.g. aiDocumentFill). Provided by the
// applicant's form pages and by the Template Builder's form view, which works
// on the template's config application.
interface ApplicationStructureState {
  structure: FullStructure
  // Remounts the page's elements. Elements copy their response into local
  // state when they mount, so one whose response is written from outside only
  // shows it after a remount.
  remountElements: () => void
  // Re-checks the whole application's validity, e.g. after responses are
  // saved without it. Not provided where nothing shows validity.
  requestRevalidation?: () => void
}

const ApplicationStructureContext = createContext<ApplicationStructureState | undefined>(undefined)

export const ApplicationStructureProvider = ApplicationStructureContext.Provider

export const useApplicationStructure = () => useContext(ApplicationStructureContext)
