import { DefaultValueFunction, NewKeyOptionsFunction } from 'json-edit-react'

export const newKeyOptions: NewKeyOptionsFunction = ({ key }) => {
  if (type === 'object') {
    return {
      key,
      type,
      description: 'New object',
      default: {},
    }
  } else if (type === 'array') {
    return {
      key,
      type,
      description: 'New array',
      default: [],
    }
  }
}

export const defaultValue: DefaultValueFunction = (key, type) => {
  if (type === 'object') {
    return {}
  } else if (type === 'array') {
    return []
  } else if (type === 'string') {
    return ''
  } else if (type === 'number') {
    return 0
  } else if (type === 'boolean') {
    return false
  }
  return null
}
