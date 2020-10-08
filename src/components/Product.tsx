import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { List, Label } from 'semantic-ui-react'
import { useRouter } from '../hooks/useRouter'

export const ProductList: React.FC = () => {
  const { pathname, query } = useRouter()

  return (
    <div>
      <h1>Registered Products</h1>
      <p>List of (public) registered products in the system.</p>
      <p>Can be filtered with query parameters, e.g:</p>

      <List>
        <List.Item>
          <Link to="?type=pharmaceutical">Pharamaceutical products</Link>
        </List.Item>
        <List.Item>
          <Link to="?expiration=20">Products whose registration expires in the next 20 days.</Link>
        </List.Item>
        <List.Item>
          <Link to="?class=A&expired=true">Expired Class A drugs.</Link>
        </List.Item>
        <List.Item>
          <Link to={pathname}>Reset query</Link>
        </List.Item>
      </List>
      {Object.keys(query).length > 0 && <h4>Query parameters:</h4>}
      <List>
        {Object.entries(query).map(([key, value]) => (
          <List.Item>{key + ' : ' + value}</List.Item>
        ))}
      </List>
      <h4>Product List:</h4>
      <Label>
        <Link to={'/products/XYZ276'}>Drug A - registered by Company B. Exp: 2020/12/10</Link>
      </Label>
    </div>
  )
}

type TParams = { productId: string }

export const Product: React.FC = () => {
  const { productId }: TParams = useParams()

  return (
    <div>
      <h1>Drug A</h1>
      <h2>Company B</h2>
      <p>Info for Product with id: {productId}.</p>
      <p>
        <Link to="/products">Back to Products</Link>
      </p>
    </div>
  )
}
