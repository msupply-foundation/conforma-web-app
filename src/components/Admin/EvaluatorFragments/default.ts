import { FragmentRow } from './useFragmentConfig'

export const defaultNewFragment: Omit<FragmentRow, 'id'> = {
  name: 'Example Fragment',
  expression: {
    operator: '?',
    condition: '$showUsername',
    valueIfTrue: {
      operator: 'stringSubstitution',
      string: '%1 %2',
      replacements: [
        {
          operator: 'getData',
          property: 'currentUser.firstName',
        },
        {
          operator: 'getData',
          property: 'currentUser.lastName',
        },
      ],
    },
    valueIfFalse: {
      operator: 'getData',
      property: 'currentUser.username',
    },
    outputType: 'string',
  },
  metadata: {
    description: "Displays either the current user's full name OR username, based on a parameter",
    parameters: [
      {
        name: '$showUsername',
        type: 'boolean',
        required: true,
        description: 'Whether or not to show the username instead of the full name',
        default: false,
      },
    ],
    textColor: '#333333',
    backgroundColor: '#f8f9fa',
  },
  frontEnd: true,
  backEnd: false,
  permissionNames: ['applyGeneral'],
}
