import config from '../../config'

// The auth tokens live in HttpOnly cookies, so the front-end can't inspect them
// to answer this. Instead we keep a local flag, set on login and cleared on
// logout, and treat it as "there should be a session". If it's wrong (the
// session was revoked or expired server-side), the next request comes back
// unauthenticated and we get returned to the login screen.
const isLoggedIn = () => !!localStorage.getItem(config.localStorageLoginKey)

export default isLoggedIn
