// Schema derived from the Typescript interface "Preferences" below, and
// converted using ChatGPT:

export const PreferencesSchema = {
  type: 'object',
  properties: {
    server: {
      type: 'object',
      properties: {
        logoutAfterInactivity: { type: 'number' },
        thumbnailMaxWidth: { type: 'number' },
        thumbnailMaxHeight: { type: 'number' },
        actionSchedule: { $ref: '#/definitions/schedule' },
        SMTPConfig: {
          type: 'object',
          properties: {
            host: { type: 'string' },
            port: { type: 'number' },
            secure: { type: 'boolean' },
            user: { type: 'string' },
            password: { type: 'string' },
            defaultFromName: { type: 'string' },
            defaultFromEmail: { type: 'string' },
          },
          required: [
            'host',
            'port',
            'secure',
            'user',
            'password',
            'defaultFromName',
            'defaultFromEmail',
          ],
          additionalProperties: false,
        },
        systemManagerPermissionName: { type: 'string' },
        managerCanEditLookupTables: { type: 'boolean' },
        managerCanEditLocalisation: { type: 'boolean' },
        previewDocsMinKeepTime: { type: 'string' },
        fileCleanupSchedule: { $ref: '#/definitions/schedule' },
        backupSchedule: { $ref: '#/definitions/schedule' },
        backupFilePrefix: { type: 'string' },
        skipBackup: { type: 'boolean' },
        maxBackupDurationDays: { type: 'number' },
        archiveSchedule: { $ref: '#/definitions/schedule' },
        archiveFileAgeMinimum: { type: 'number' },
        archiveMinSize: { type: 'number' },
        emailTestMode: { type: 'boolean' },
        testingEmail: { type: 'string' },
        locale: { type: 'string' },
        timezone: { type: 'string' },
        externalApiConfigs: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              baseUrl: { type: 'string' },
              authentication: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      type: { const: 'Basic' },
                      username: { type: 'string' },
                      password: { type: 'string' },
                    },
                    required: ['type', 'username', 'password'],
                    additionalProperties: false,
                  },
                  {
                    type: 'object',
                    properties: { type: { const: 'Bearer' }, token: { type: 'string' } },
                    required: ['type', 'token'],
                    additionalProperties: false,
                  },
                ],
              },
              routes: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    method: { enum: ['get', 'post'] },
                    url: { type: 'string' },
                    permissions: { type: 'array', items: { type: 'string' } },
                    queryParams: { type: 'object', additionalProperties: true },
                    allowedClientQueryParams: { type: 'array', items: { type: 'string' } },
                    additionalAxiosProperties: { type: 'object', additionalProperties: true },
                    returnProperty: { type: 'string' },
                    validationExpression: { type: 'object' },
                  },
                  required: ['method', 'url'],
                  additionalProperties: false,
                },
              },
            },
            required: ['baseUrl', 'authentication', 'routes'],
            additionalProperties: false,
          },
        },
        envVars: { type: 'array', items: { type: 'string' } },
        maintenanceSite: { type: 'string' },
      },
      additionalProperties: false,
    },
    web: {
      type: 'object',
      properties: {
        paginationPresets: { type: 'array', items: { type: 'number' } },
        paginationDefault: { type: 'number' },
        defaultLanguageCode: { type: 'string' },
        brandLogoFileId: { type: 'string' },
        brandLogoOnDarkFileId: { type: 'string' },
        defaultListFilters: { type: 'array', items: { type: 'string' } },
        showDocumentModal: { type: 'boolean' },
        googleAnalyticsId: { type: 'string' },
        siteHost: { type: 'string' },
        userRegistrationCode: { type: 'string' },
        style: { type: 'object', additionalProperties: { type: 'object' } },
        helpLinks: {
          type: 'array',
          items: {
            type: 'object',
            properties: { text: { type: 'string' }, link: { type: 'string' } },
            required: ['text', 'link'],
            additionalProperties: false,
          },
        },
        footerText: { type: 'string' },
        footerLogoId: { type: 'string' },
        publicUrlMap: {
          type: 'object',
          additionalProperties: {
            oneOf: [
              { type: 'string' },
              {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  urlQuery: {
                    type: 'object',
                    additionalProperties: {
                      oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
                    },
                  },
                },
                required: ['code', 'urlQuery'],
                additionalProperties: false,
              },
            ],
          },
        },
      },
      additionalProperties: false,
    },
  },
  required: ['server', 'web'],
  definitions: {
    schedule: {
      oneOf: [
        { type: 'array', items: { type: 'number' } },
        {
          type: 'object',
          properties: {
            date: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            dayOfWeek: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            hour: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            minute: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            month: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            second: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            year: {
              oneOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            tz: { type: ['string', 'null'] },
          },
          additionalProperties: false,
        },
      ],
    },
  },
}

export interface Preferences {
  server: {
    logoutAfterInactivity?: number // Minutes
    thumbnailMaxWidth?: number
    thumbnailMaxHeight?: number
    actionSchedule?:
      | number[]
      | {
          date?: number | number[] | null
          dayOfWeek?: number | number[] | null
          hour?: number | number[] | null
          minute?: number | number[] | null
          month?: number | number[] | null
          second?: number | number[] | null
          year?: number | number[] | null
          tz?: string | null
        }
    SMTPConfig?: {
      host: string
      port: number
      secure: boolean
      user: string
      password: string
      defaultFromName: string
      defaultFromEmail: string
    }
    systemManagerPermissionName?: string
    managerCanEditLookupTables?: boolean
    managerCanEditLocalisation?: boolean
    previewDocsMinKeepTime?: string
    fileCleanupSchedule?:
      | number[]
      | {
          date?: number | number[] | null
          dayOfWeek?: number | number[] | null
          hour?: number | number[] | null
          minute?: number | number[] | null
          month?: number | number[] | null
          second?: number | number[] | null
          year?: number | number[] | null
          tz?: string | null
        }
    backupSchedule?:
      | number[]
      | {
          date?: number | number[] | null
          dayOfWeek?: number | number[] | null
          hour?: number | number[] | null
          minute?: number | number[] | null
          month?: number | number[] | null
          second?: number | number[] | null
          year?: number | number[] | null
          tz?: string | null
        }
    backupFilePrefix?: string
    skipBackup?: boolean
    maxBackupDurationDays?: number
    archiveSchedule?:
      | number[]
      | {
          date?: number | number[] | null
          dayOfWeek?: number | number[] | null
          hour?: number | number[] | null
          minute?: number | number[] | null
          month?: number | number[] | null
          second?: number | number[] | null
          year?: number | number[] | null
          tz?: string | null
        }
    archiveFileAgeMinimum?: number
    archiveMinSize?: number // MB
    emailTestMode?: boolean
    testingEmail?: string
    locale?: string
    timezone?: string
    externalApiConfigs?: {
      [key: string]: {
        baseUrl: string
        authentication:
          | { type: 'Basic'; username: string; password: string }
          | { type: 'Bearer'; token: string }
        routes: {
          [key: string]:
            | {
                method: 'get'
                url: string
                permissions?: string[]
                queryParams?: { [key: string]: any }

                allowedClientQueryParams?: string[]
                additionalAxiosProperties?: { [key: string]: any }
                returnProperty?: string
                validationExpression?: object
              }
            | {
                method: 'post'
                url: string
                permissions?: string[]
                queryParams?: { [key: string]: any }

                allowedClientQueryParams?: string[]
                additionalAxiosProperties?: { [key: string]: any }
                returnProperty?: string
                validationExpression?: object
              }
        }
      }
    }
    envVars?: string[]
    maintenanceSite?: string
  }
  web: {
    paginationPresets?: number[]
    paginationDefault?: number
    defaultLanguageCode?: string
    brandLogoFileId?: string
    brandLogoOnDarkFileId?: string
    defaultListFilters?: string[]
    showDocumentModal?: boolean
    googleAnalyticsId?: string
    siteHost?: string
    userRegistrationCode?: string
    style?: Record<string, object> // Must be valid CSS definitions
    helpLinks?: { text: string; link: string }[]
    footerText?: string
    footerLogoId?: string
    publicUrlMap?: Record<
      string,
      string | { code: string; urlQuery: Record<string, string | number | boolean> }
    >
  }
}
