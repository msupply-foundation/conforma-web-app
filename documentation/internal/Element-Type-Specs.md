_Ongoing authoritative reference of Template Question/Element types, including input parameters and response type (shape). Please ensure this document matches the current implementation at all times._

## Template Element fields

- **id, section_id** : database references
- **code**: `string` -- unique (per template) identifier
- **index**: `integer` -- element ordering sequence (starting at `0`)
- **title**: `string` -- describes the element, shown in template builder (probably)
- **category**: `enum` -- either "Information" or "Question"
- **visibility_condition**: `JSON` -- dynamic query determining whether element appears to the user
  - default: `{"value": true}` (i.e. it always appears)
- **element_type_plugin_code**: `string` -- code of the question/element plugin that presents this element to the UI
- **is_required**: `JSON` -- dynamic query determining whether question is required to be answered
  - default: `{"value": true}`
- **is_editable**: `JSON` -- dynamic query determining whether can be edited (Would only be false in rare circumstances)
  - default: `{"value": true}`
- **parameters**: `JSON` -- the parameters specific to each question/element type. See individual plugins below for parameter breakdown
- **validation**: `JSON` -- a dynamic expression for checking if the user's response is a valid input.
  - default: `{"value": true}`
- **validation_message**: `string` -- the message that shows in the UI when validation fails.

## Question/Element types

**Note**: all parameter fields can also have a dynamic query object instead of a primitive. The [`evaluateExpression`](https://github.com/openmsupply/application-manager-server/wiki/Query-Syntax) function will return literal strings (or numbers, booleans) as is. The types described for the parameters below are the type that is expected to be _returned_ from a query expression.

### Short Text Input _(not yet implemented -- highest priority)_

- **type/code**: `shortText`
- **category**: `Question`

_Free-form, single-line text input element_

#### Input parameters (in the `parameters` JSON)

- **label**: `string` -- Text that shows in the HTML "label" attribute of the form element (suggestion: make this interpret Markdown)
- **description**: `string` -- additional explanatory text (usually not required) [Optional]
- **placeholder**: `string`-- text to display before user input (HTML "placeholder" attribute) [Optional]
- **maskedInput**: `boolean` -- if `true`, displays user input as masked (hidden) characters -- i.e. for passwords. [Optional]
- **minWidth**/**maxWidth**: `integer` -- optional controls over visual display [Optional] _(We may never use these)_

#### Response type

_This describes the expected object that will be stored in the `application_response` table `value` field. from the user's response_
`{ text: <string> }`

---

### Text Information _(not yet implemented)_

- **type/code**: `textInfo`
- **category**: `Information`

_For displaying blocks of text in the application_

#### Input parameters

- **title**: `string` -- Heading text to display [Optional]
- **text**: `string` -- body text to display
  _(Maybe have some formatting options, but not initially, although `text` should support Markdown)_

---

### Radio Buttons _(not yet implemented)_

- **type/code**: `radioChoice`
- **category**: `Question`

_Multi-choice question, with one allowed selection, displayed as labelled radio buttons_

#### Input parameters

- **label**: `string` -- as above
- **description**: `string` -- as above [Optional]
- **options**: `array[string]` -- the options for the radio buttons
- **default**: `string`/`number` -- the value initially selected before user input. If `number`, refers to the index of the options array. If not provided, no options will be pre-selected.
- **hasOther**: `boolean` -- if `true`, an additional text-entry field is provided so the user can add their own alternative option _(may not implement in first iteration but good to have the option in future)_

#### Response type

```
{
  optionIndex: <integer> (index from the options array)
  text: <string> (actual text from options array)
  reference?: To-do: some way to link the response to an entity in database (e.g. an organisation)
  -- @nmadruga maybe you have an idea of what we'd need here
}

```

---

### Drop-down Selector _(not yet implemented)_

- **type/code**: `dropdownChoice`
- **category**: `Question`

_Multi-choice question, with one allowed option, displayed as Drop-down list (Combo-box)_

#### Input parameters

- **label**: `string` -- as above
- **description**: `string` -- as above [Optional]
- **options**: `array[string]` -- as above
- **default**: `string`/`number` -- if not provided, defaults to index 0.

#### Response type

```
{
  optionIndex: <integer> (index from the options array)
  text: <string> (actual text from options array)
  reference?: To-do -- as above
}

```

---

### Page Break _(not yet implemented)_

- **type/code**: `pageBreak`
- **category**: `Information`

_For specifying where the list of questions is broken into UI pages/steps. The **previous** question of this element will be the **last** element on a page_

#### Input parameters

- **pageBreakValidityCheck**: `boolean` -- If `true`, the user cannot proceed to the next page unless _all_ questions on the current page have passed validation
  - default: `false`
