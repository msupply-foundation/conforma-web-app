import { ApplicationElementStates, ResponsesByCode } from '../types'
import { defaultValidate } from '../../formElementPlugins/defaultValidate'

export const validateAll = (
  elementsState: ApplicationElementStates | undefined,
  responsesByCode: ResponsesByCode | undefined,
  strict = true
): boolean => {
  const validate = defaultValidate // To-Do: import custom validations

  if (elementsState) {
    const elementCodes = Object.keys(elementsState).filter(
      (key) => elementsState[key].category === 'QUESTION'
    )
    const validationExpressions = elementCodes.map((code) => elementsState[code].validation)

    const evaluatedValidations = []

    for (let i = 0; i < elementCodes.length; i++) {
      const code = elementCodes[i]
      const thisResponse = responsesByCode
        ? responsesByCode[code]?.text
          ? responsesByCode[code]?.text
          : responsesByCode[code]
        : null
      const responses = { thisResponse, ...responsesByCode }
      const expression = validationExpressions[i]
      evaluatedValidations.push(
        validate(expression, elementsState[code]?.validationMessage as string, {
          objects: [responses],
          APIfetch: fetch,
        })
      )
    }
    Promise.all(evaluatedValidations).then((result) => {
      // DO SIDE-EFFECTS HERE: Check isValid changed and write if so

      // Also filter for isVisible and isRequired (strict)
      return result.every((x) => x.isValid)
    })
  }

  return true
}
