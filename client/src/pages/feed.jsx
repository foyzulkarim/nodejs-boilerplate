import { Helmet } from 'react-helmet-async';

import { ProductsView } from 'src/sections/feed/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title> Feed</title>
      </Helmet>

      <ProductsView />
    </>
  );
}
