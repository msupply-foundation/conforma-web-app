import { defineMessages } from 'react-intl'

const ProductListDemoTranslations = defineMessages({
  registered_products: {
    description: 'Header 1', // Description should be a string literal
    defaultMessage: 'Registered Products', // Message should be a string literal
  },
  registered_products2: {
    description: 'Testing if this would be seperate instance even though default message are same', // Description should be a string literal
    defaultMessage: 'Registered Products', // Message should be a string literal
  },
  demo_manual_id_00222: {
    id: 'manual-id-00222',
    description: 'Manual id test',
    defaultMessage: 'Manual id test',
  },
})

export default ProductListDemoTranslations
