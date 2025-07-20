import { DefaultValueFunction, NewKeyOptionsFunction, extract } from 'json-edit-react'
import { Preferences } from './schema'

export const newKeyOptions: NewKeyOptionsFunction = ({ key }) => {
  switch (key) {
    case 'server':
      return Object.keys(defaultPrefs.server)
    case 'web':
      return Object.keys(defaultPrefs.web)
  }
}

export const defaultValue: DefaultValueFunction = ({ path, value }, newKey) => {
  if (Array.isArray(value)) {
    // If we're adding to an existing array, just get the first item from the
    // defaultPrefs array
    const defaultArray = extract(defaultPrefs, path as string[], [])
    return defaultArray[0] ?? ''
  }

  const fullPath = [...path, newKey]
  return extract(defaultPrefs, fullPath as string[], null)
}

const defaultPrefs: Preferences = {
  server: {
    logoutAfterInactivity: 60,
    thumbnailMaxWidth: 300,
    thumbnailMaxHeight: 300,
    actionSchedule: {
      // Every hour on the hour
      hour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      minute: 0,
    },
    SMTPConfig: {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      user: 'user@example.com',
      password: 'dummyPassword123',
      defaultFromName: 'Example Sender',
      defaultFromEmail: 'sender@example.com',
    },
    systemManagerPermissionName: 'systemManager',
    managerCanEditLookupTables: true,
    managerCanEditLocalisation: true,
    previewDocsMinKeepTime: '2 hours',
    fileCleanupSchedule: {
      // Once per day at 1:05am
      hour: 1,
      minute: 5,
    },
    backupSchedule: {
      // Once per day at 1:15am
      hour: 1,
      minute: 15,
    },
    backupFilePrefix: 'backup_',
    skipBackup: false,
    maxBackupDurationDays: 30,
    archiveSchedule: {
      // Twice per week on Weds/Sun at 1:10am
      dayOfWeek: [0, 3],
      hour: 1,
      minute: 10,
    },
    archiveFileAgeMinimum: 7,
    archiveMinSize: 100,
    emailTestMode: false,
    testingEmail: 'test@example.com',
    locale: 'en-NZ',
    timezone: 'Pacific/Auckland',
    externalApiConfigs: {
      exampleAPI: {
        baseUrl: 'https://api.example.com',
        authentication: {
          type: 'Bearer',
          token: 'example-token-123',
        },
        routes: {
          getUser: {
            method: 'get',
            url: 'https://api.example.com/user',
            permissions: ['admin'],
            queryParams: { active: true },
            allowedClientQueryParams: ['active'],
            additionalAxiosProperties: { timeout: 1000 },
            returnProperty: 'data',
            validationExpression: {},
          },
          createUser: {
            method: 'post',
            url: 'https://api.example.com/user',
            permissions: ['admin'],
            queryParams: { name: 'user' },
            allowedClientQueryParams: ['name'],
            additionalAxiosProperties: { timeout: 2000 },
            returnProperty: 'id',
            validationExpression: {},
          },
        },
      },
    },
    envVars: ['FILE_OUTPUT_PATH', 'API_KEY'],
    maintenanceSite: 'https://maintenance.example.com',
  },
  web: {
    paginationPresets: [10, 25, 50],
    paginationDefault: 25,
    defaultLanguageCode: 'en',
    brandLogoFileId: 'IcSv2ahfQ3X_F0W3ViS_c',
    brandLogoOnDarkFileId: 'y2B-XZ6gkf-0hqKV-sWfz',
    defaultListFilters: ['applicantDeadline', 'reviewers', 'reviewerAction', 'stage'],
    userRegistrationCode: 'demoRegistration',
    style: {
      '#user-area': {
        'background-color': '#9c85c4',
      },
      '#footer': {
        'background-color': 'black',
      },
      '#footer p': {
        color: '#e1e1e1',
      },
    },
    helpLinks: [
      { text: 'Support', link: 'https://support.example.com' },
      { text: 'Documentation', link: 'https://docs.example.com' },
    ],
    googleAnalyticsId: 'UA-12345678-9',
    siteHost: 'https://www.example.com',
    footerText: '© 2025 Example Corp. All rights reserved.',
    footerLogoId: 'footerLogo456',
    showDocumentModal: true,
    publicUrlMap: {
      'user-reg': 'UserRegistration',
      test: {
        code: 'demoRegistration',
        urlQuery: {
          dataFile: 'accreditation.sqlite',
          selectVersion: true,
        },
      },
    },
  },
}
