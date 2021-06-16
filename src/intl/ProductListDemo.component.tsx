import React from 'react'
import { FormattedMessage, IntlProvider, FormattedNumber } from 'react-intl'
import { Link } from 'react-router-dom'
import { List, Label, Container, Header } from 'semantic-ui-react'
import { useRouter } from '../utils/hooks/useRouter'

const messagesInFrench = {
  myMessage: "Aujourd'hui, c'est le {ts, date, ::yyyyMMdd}",
}

const ProductListDemo: React.FC = () => {
  const { pathname } = useRouter()

  return (
    <IntlProvider messages={messagesInFrench} locale="fr" defaultLocale="en">
      <Container text>
        <Header as="h1" content="Registered Products" />
        <Header as="h2" content="List of (public) registered products in the system" />
        <Header as="h3" content="Can be filtered with query parameters, e.g:" />
        <List>
          <List.Item content="Pharamaceutical products" as={Link} to="?type=pharmaceutical" />
          <List.Item
            content="Products expiring in the next 20 days."
            as={Link}
            to="?expiration=20"
          />
          <List.Item content="Expired Class A drugs." as={Link} to="?class=A&expired=true" />
          <List.Item content="Reset query" as={Link} to={pathname} />
        </List>
        <p>
          <FormattedMessage
            id="myMessage"
            defaultMessage="Today is {ts, date, ::yyyyMMdd}"
            values={{ ts: Date.now() }}
          />
          <br />
          <FormattedNumber value={19} style="currency" currency="EUR" />
          <br />
        </p>
        <Header as="h4" content="Product List:" />
        <Label>
          <Link to={'/products/XYZ276'}>Drug A - registered by Company B. Exp: 2020/12/10</Link>
        </Label>
      </Container>
    </IntlProvider>
  )
}

export default ProductListDemo
