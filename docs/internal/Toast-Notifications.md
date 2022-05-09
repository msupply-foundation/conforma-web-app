**Semantic UI** doesn't have a built-in alerts component ([Toast](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html), [Snackbar](https://mui.com/material-ui/react-snackbar/), etc.), so we've created a basic "toast" module that can be called easily from anywhere in the app.

<!-- Add an image here -->

The module uses a React Context to store global state of the alerts, and injects a Provider near the top of the component tree. The actual HTML element is an absolutely-positioned container near the body root.

It is made available to any other component in the app via a custom hook: `useToast`

## Usage

Import module from `/contexts` folder:

```
import { useToast, ToastStyle, Position } from './<path>/contexts/Toast'
```

Get the `showToast` function returned from the hook:

```
const showToast = useToast(<optional-config>)
```
(More about the `<optional-config>` later)

Then simply call the function whenever required:

```
showToast( { title: "Congratulations", text: "Your first Toast", style: "success" } )
```

