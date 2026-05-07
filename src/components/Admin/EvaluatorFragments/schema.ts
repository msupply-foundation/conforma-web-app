export const FragmentDataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  title: 'FragmentData',
  description: 'Schema for FigTree Fragment',
  properties: {
    name: { type: 'string', description: 'Name of the fragment' },
    // expression: {
    //   type: 'object',
    //   description: 'FigTree Expression object with flexible structure',
    // },
    metadata: {
      type: 'object',
      description: 'Metadata information for the fragment, passed to FigTree',
      properties: {
        description: { type: 'string', description: 'Optional description of the fragment' },
        parameters: {
          type: 'array',
          description: 'Array of parameter definitions',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Parameter name' },
              type: {
                oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                description: 'Parameter type - can be a string or array of strings',
              },
              required: { type: 'boolean', description: 'Whether the parameter is required' },
              description: { type: 'string', description: 'Optional parameter description' },
              default: { description: 'Default value for the parameter - can be any type' },
            },
            required: ['name', 'type', 'required'],
            additionalProperties: false,
          },
        },
        textColor: { type: 'string', description: 'Optional text color' },
        backgroundColor: { type: 'string', description: 'Optional background color' },
      },
      additionalProperties: false,
    },
    frontEnd: { type: 'boolean', description: 'Whether this fragment is used on the front end' },
    backEnd: { type: 'boolean', description: 'Whether this fragment is used on the back end' },
    permissionNames: {
      oneOf: [{ type: 'array', items: { type: 'string' } }, { type: 'null' }],
      description: 'Array of permission names or null',
    },
  },
  required: [
    'name',
    // 'expression',
    'metadata',
    'frontEnd',
    'backEnd',
    'permissionNames',
  ],
  additionalProperties: false,
}

// export interface FragmentData {
//   name: string
//   expression: object
//   metadata: {
//     description?: string
//     parameters?: {
//       name: string
//       type: string | string[]
//       required: boolean
//       description?: string
//       default?: unknown
//     }[]
//     textColor?: string
//     backgroundColor?: string
//   }
//   frontEnd: boolean
//   backEnd: boolean
//   permissionNames: string[] | null
// }
