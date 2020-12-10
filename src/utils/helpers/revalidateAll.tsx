import { ApplicationElementStates, ResponsesByCode } from '../types'
import { defaultValidate } from '../../formElementPlugins/defaultValidate'

export const revalidateAll = (
  elementsState: ApplicationElementStates | undefined,
  responsesByCode: ResponsesByCode | undefined,
  strict = true,
  shouldUpdateDatabase = true
): boolean => {
  const validate = defaultValidate // To-Do: import custom validations

  console.log('Elements', elementsState)
  console.log('responses', responsesByCode)
  if (elementsState) {
    const elementCodes = Object.keys(elementsState).filter(
      (key) =>
        responsesByCode && // Typescript requires this
        elementsState[key].category === 'QUESTION' &&
        elementsState[key].isVisible === true &&
        // Strict/Loose validation logic:
        ((strict && elementsState[key].isRequired) ||
          (strict && responsesByCode[key]?.isValid !== null) ||
          (!strict && responsesByCode[key]?.isValid !== null))
    )

    console.log('Keys', elementCodes)
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
    Promise.all(evaluatedValidations).then((resultArray) => {
      // DO SIDE-EFFECTS HERE: Check isValid changed and write if so
      console.log('Result', resultArray)
      const validityChanges: any = []
      if (shouldUpdateDatabase) {
        elementCodes.forEach((code, index) => {
          console.log(code)
          if (elementsState[code].validation.value !== resultArray[index].isValid) {
            validityChanges.push({
              id: elementsState[code].id,
              isValid: resultArray[index].isValid,
            })
          }
        })
      }
      return { allValid: resultArray.every((element) => element.isValid), validityChanges }
    })
  }

  return true
}
