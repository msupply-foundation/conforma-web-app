# Frontend Repo: App routes

## Creating basic components

* Install a dependecy package for components

`yarn add prop-types`

* Add some new files to keep the new components

`cd src/components`\
`touch Home.js Form.js Footer.js NavigationMenu.js NoMatch.js`\
`cd ../..`

* Open the file `NoMatch.js` and add the following:
```
import React from 'react';
import { Icon, Header, Segment } from 'semantic-ui-react';

const NoMatch = () => {
  return (
    <Segment>
      <Icon name="minus circle" size="big" />
      <strong>Page not found!</strong>
    </Segment>
  );
};

export default NoMatch
```

* Open the file `Footer.js` and add the following:

```
import React from 'react'
import { Segment, Container, Icon } from 'semantic-ui-react'

const Footer = () => (
    <Segment inverted>
        <Container textAlign="center">
            semantic-ui-react menu example with react-router-dom
            <Icon name="react" style={{ marginLeft: '5px' }} />
        </Container>
    </Segment>
)

export default Footer
```

* Open the file `Home.js` and add the following:

```
import React from 'react';
import { Label } from 'semantic-ui-react';

const Home = () => {
  return (
    <Label>Home Page</Label>
  );
};

export default Home
```
* Open the file `Form.js` and add the following:

```
import React from 'react'
import { Form, Checkbox, Button } from 'semantic-ui-react'

const FormExampleForm = () => (
    <Form>
      <Form.Field>
        <label>First Name</label>
        <input placeholder='First Name' />
      </Form.Field>
      <Form.Field>
        <label>Last Name</label>
        <input placeholder='Last Name' />
      </Form.Field>
      <Form.Field>
        <Checkbox label='I agree to the Terms and Conditions' />
      </Form.Field>
      <Button type='submit'>Submit</Button>
    </Form>
  )
  
  export default FormExampleForm
  ```

## Creating the nav-bar

Check out how this component uses `Prop-types` to define what **props** should be passed to it. This component uses React router link to map each option on the nav-bar to a page Route which loads its component.

* Open the file `NavigationMenu.js` and add the following:

```
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, Container, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

class HeaderMenu extends Component {
    render() {
        const headerIcon = <Icon name={this.props.headerIcon} size="large" />

        let menuItems = []
        for (let i = 0; i < this.props.items.length; i++) {
            if (this.props.items[i].length !== 2) {
                console.error(
                    'HeaderMenu: items format should be ["name", "route"]'
                )
                break
            }
            const name = this.props.items[i][0]
            const route = this.props.items[i][1]
            menuItems.push(
                <Menu.Item
                    key={'item-' + i}
                    index={i}
                    as={Link}
                    to={route}
                    header={i === 0}
                    active={route === this.props.location.pathname}
                >
                    {i === 0 ? headerIcon : ''}
                    {name}
                </Menu.Item>
            )
        }

        return (
            <Menu fixed="top" inverted>
                <Container>{menuItems}</Container>
            </Menu>
        )
    }
}

HeaderMenu.propTypes = {
    onItemClick: PropTypes.func.isRequired,
    headerIcon: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.array.isRequired).isRequired,
}

export default withRouter(HeaderMenu)
```

## Creating our main App

This component holds the main layout and Router to other pages.

* Open the file `App.js` and copy the folowing:

```
import React from 'react'
import { hot } from 'react-hot-loader/root'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Divider, Container, Segment } from 'semantic-ui-react'

import NavigationMenu from '.NavigationMenu'
import Footer from '.Footer'
import Form from './Form'
import Home from '..Home'
import NoMatch from '.NoMatch'

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <NavigationMenu
                        onItemClick={(item) => this.onItemClick(item)}
                        items={[
                            ['Home', '/'],
                            ['Form', '/form']
                        ]}
                        headerIcon={'compass outline'}
                    />
                    <Divider />
                    <Segment inverted>
                        <Container fluid>
                            <Switch>
                                <Route path="/" exact component={Home} />
                                <Route path='/form' component={Form} />
                                <Route component={NoMatch} />
                            </Switch>
                        </Container>
                    </Segment>
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default hot(App)
```

## Summary

* Run the example:

`yarn dev`

This example is using React router in the main file `App.js`. And the entire `<App>` component is wrapped using React-hot-loader which refreshs the App every time any file is saved (on development mode).
Each `<Route>` is defined in between the `<Switch>` (component to select the fisrt route matching) and mapped to another page linked to components (defined in other files). For this example the 2 component pages are defined in `Home.js` and `Form.js`.

The `<NavigationMenu>` is placed on the top area of the App and is also receiving items for entries to each page. 
And the `<Footer>` is defined to always show at the bottom of each page selected in the Router.

## Return to
- [Basic setup](Front-end-setup.md)

## Next
- [Graphql-hooks]
- [Eslint]
- [Components]
- [Typescript]
- [Theme]