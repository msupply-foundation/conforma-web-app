export const FragmentDataSchema = {
  type: 'object',
  properties: {
    // id: { type: 'number' },
    name: { type: 'string' },
    metadata: {
      anyOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            parameters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: {
                    anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
                  },
                  required: { type: 'boolean' },
                  description: { type: 'string' },
                  default: {},
                },
                required: ['name', 'type', 'required'],
                additionalProperties: false,
              },
            },
            textColor: { type: 'string' },
            backgroundColor: { type: 'string' },
          },
          required: ['name'],
          additionalProperties: false,
        },
        { type: 'null' },
      ],
    },
    frontEnd: { type: 'boolean' },
    backEnd: { type: 'boolean' },
    permissionNames: { anyOf: [{ type: 'array', items: { type: 'string' } }, { type: 'null' }] },
  },
  required: [
    // 'id',
    'name',
    // 'expression',
    'metadata',
    'frontEnd',
    'backEnd',
    // 'permissionNames',
  ],
  additionalProperties: false,
}
