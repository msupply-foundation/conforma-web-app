// Schema derived from the Typescript interface "Preferences" below, and
// converted using ChatGPT:

import { EvaluatorNode } from 'fig-tree-editor-react'

export const PreferencesSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['server', 'web'],
  properties: {
    server: {
      type: 'object',
      properties: {
        logoutAfterInactivity: { type: 'number' },
        thumbnailMaxWidth: { type: 'number' },
        thumbnailMaxHeight: { type: 'number' },
        actionSchedule: { $ref: '#/definitions/schedule' },
        fileCleanupSchedule: { $ref: '#/definitions/schedule' },
        backupSchedule: { $ref: '#/definitions/schedule' },
        archiveSchedule: { $ref: '#/definitions/schedule' },
        staleApplicationsCleanupSchedule: { $ref: '#/definitions/schedule' },
        SMTPConfig: {
          type: 'object',
          required: [
            'host',
            'port',
            'secure',
            'user',
            'password',
            'defaultFromName',
            'defaultFromEmail',
          ],
          properties: {
            host: { type: 'string' },
            port: { type: 'number' },
            secure: { type: 'boolean' },
            user: { type: 'string' },
            password: { type: 'string' },
            defaultFromName: { type: 'string' },
            defaultFromEmail: { type: 'string' },
          },
          additionalProperties: false,
        },
        systemManagerPermissionName: { type: 'string' },
        managerCanEditLookupTables: { type: 'boolean' },
        managerCanEditLocalisation: { type: 'boolean' },
        previewDocsMinKeepTime: { type: 'string' },
        backupFilePrefix: { type: 'string' },
        skipBackup: { type: 'boolean' },
        maxBackupDurationDays: { type: 'number' },
        archiveFileAgeMinimum: { type: 'number' },
        archiveMinSize: { type: 'number' },
        emailTestMode: { type: 'boolean' },
        testingEmail: { type: 'string' },
        locale: { type: 'string' },
        timezone: { type: 'string' },
        envVars: {
          type: 'array',
          items: { type: 'string' },
        },
        maintenanceSite: { type: 'string' },
        freeSpaceRequiredForZips: { type: 'number' },
        externalApiConfigs: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            required: ['baseUrl', 'authentication', 'routes'],
            properties: {
              baseUrl: { type: 'string' },
              authentication: {
                oneOf: [
                  {
                    type: 'object',
                    required: ['type', 'username', 'password'],
                    properties: {
                      type: { const: 'Basic' },
                      username: { type: 'string' },
                      password: { type: 'string' },
                    },
                  },
                  {
                    type: 'object',
                    required: ['type', 'token'],
                    properties: {
                      type: { const: 'Bearer' },
                      token: { type: 'string' },
                    },
                  },
                ],
              },
              routes: {
                type: 'object',
                additionalProperties: {
                  oneOf: [
                    {
                      type: 'object',
                      required: ['method', 'url'],
                      properties: {
                        method: { const: 'get' },
                        url: { type: 'string' },
                        permissions: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        queryParams: { type: 'object' },
                        allowedClientQueryParams: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        additionalAxiosProperties: { type: 'object' },
                        returnProperty: { type: 'string' },
                        validationExpression: { type: 'object' },
                      },
                    },
                    {
                      type: 'object',
                      required: ['method', 'url'],
                      properties: {
                        method: { const: 'post' },
                        url: { type: 'string' },
                        permissions: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        queryParams: { type: 'object' },
                        allowedClientQueryParams: {
                          type: 'array',
                          items: { type: 'string' },
                        },
                        additionalAxiosProperties: { type: 'object' },
                        returnProperty: { type: 'string' },
                        validationExpression: { type: 'object' },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      },
      additionalProperties: false,
    },
    web: {
      type: 'object',
      properties: {
        paginationPresets: {
          type: 'array',
          items: { type: 'number' },
        },
        paginationDefault: { type: 'number' },
        defaultLanguageCode: { type: 'string' },
        brandLogoFileId: { type: 'string' },
        brandLogoOnDarkFileId: { type: 'string' },
        defaultListFilters: {
          type: 'array',
          items: { type: 'string' },
        },
        showDocumentModal: { type: 'boolean' },
        googleAnalyticsId: { type: 'string' },
        siteHost: { type: 'string' },
        userRegistrationCode: { type: 'string' },
        style: {
          type: 'object',
          additionalProperties: { type: 'object' },
        },
        helpLinks: {
          type: 'array',
          items: {
            type: 'object',
            required: ['text', 'link'],
            properties: {
              text: { type: 'string' },
              link: { type: 'string' },
            },
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
                required: ['code', 'urlQuery'],
                properties: {
                  code: { type: 'string' },
                  urlQuery: {
                    type: 'object',
                    additionalProperties: {
                      type: ['string', 'number', 'boolean'],
                    },
                  },
                },
              },
            ],
          },
        },
        appDataTestApplications: {
          type: 'array',
          items: { type: 'string' },
        },
        figTreeDefaults: {
          type: 'object',
          properties: {
            defaultNewOperatorExpression: { type: 'object' },
            defaultNewFragment: { type: 'string' },
            defaultNewCustomOperator: { type: 'string' },
          },
        },
      },
      additionalProperties: false,
    },
  },
  definitions: {
    schedule: {
      oneOf: [
        { type: 'null' },
        {
          type: 'array',
          items: { type: 'number' },
        },
        {
          type: 'object',
          properties: {
            date: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            dayOfWeek: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            hour: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            minute: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            month: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            second: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            year: {
              anyOf: [
                { type: 'number' },
                { type: 'array', items: { type: 'number' } },
                { type: 'null' },
              ],
            },
            tz: {
              type: ['string', 'null'],
            },
          },
          additionalProperties: false,
        },
      ],
    },
  },
  additionalProperties: false,
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
    staleApplicationsCleanupSchedule?:
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
      | null
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
    freeSpaceRequiredForZips?: number // GB
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
    appDataTestApplications?: string[]
    figTreeDefaults?: {
      defaultNewOperatorExpression?: EvaluatorNode
      defaultNewFragment?: string
      defaultNewCustomOperator?: string
    }
  }
}
