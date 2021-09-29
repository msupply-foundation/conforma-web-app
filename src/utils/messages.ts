export default {
  APPLICATIONS_LIST_EMPTY: 'No applications found',
  APPLICATION_MISSING_TEMPLATE: '',
  APPLICATION_OTHER_CHANGES_MADE: 'This is a new submission and will require a review.',
  APPLICATION_DELETION_CONFIRM: {
    title: 'Delete application',
    message: 'Please confirm you would like to delete a draft application',
    option: 'OK',
  },
  LOGIN_WELCOME: 'Welcome, %1',
  LOGIN_ORG_SELECT: 'Please select an organisation',
  VALIDATION_FAIL: {
    title: 'Validation failed',
    message: 'Please fix invalid fields before continuing',
    option: 'OK',
  },
  REVIEW_SUBMISSION_CONFIRM: {
    title: 'Submitting Review',
    message: 'Are you sure?',
    option: 'SUBMIT',
  },
  REVIEW_SUBMISSION_FAIL: 'Not all sections have been reviewed',
  REVIEW_SUBMISSION_ERROR: 'Something wrong with server - review mutation failed',
  REVIEW_DECISION_SET_FAIL: {
    title: 'Problem submitting review',
    message: 'Please select a decision: List Of Questions or Non Conformity',
    option: 'OK',
  },
  REVIEW_DECISION_MISMATCH: {
    title: 'Final decision',
    message:
      'You have made a different decision than the previous reviewer.\nAre you sure you wish to proceed with your decision?',
    option: 'OK',
  },
  REVIEW_STATUS_LOCKED: {
    title: 'Currently not available for submission',
    message:
      'All your eixsing decision will be kept.\nYour review can be submitted after a new application is received from the applicant.',
    option: 'OK',
  },
  REVIEW_STATUS_PENDING: {
    title: 'Please reload review before submitting',
    message:
      'All your existing decision will be kept.\nYou will be redirected to the home page now, click "start" in there to reload page with latest responses to review.',
    option: 'OK',
  },
  REDIRECT_TO_REGISTRATION: 'Re-directing to user registration application...',
  REVIEW_RESUBMIT_COMMENT: 'Please enter a comment before asking for a re-submission',
  TRIGGER_RUNNING: 'Trigger is running. Please wait to reload page again.',
}
// To-do: create a generic string substitution function here.
