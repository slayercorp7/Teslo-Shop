import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { CartContext } from "../../context";

interface Props {
  product: IProduct;
}
const ProductPage: FC<Props> = ({ product }) => {

  const router = useRouter()
  const { addProductToCart} = useContext(CartContext)
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectSize = (size: ISize) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const onUpdatedQuantity = (quantity: number) => {
    setTempCartProduct(currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const onAddProduct = () => {
    if(tempCartProduct.quantity <= 0 ||  !tempCartProduct.size){return}
    
    //llamar la accion del context para agregar al carrito
    addProductToCart(tempCartProduct);

    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescrition={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display={"flex"} flexDirection="column">
            {/* titulos */}
            <Typography variant="h1" component={"h1"}>
              {product.title}
            </Typography>
            <Typography
              variant="subtitle1"
              component={"h2"}
            >{`$${product.price}`}</Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter 
              currentValue={tempCartProduct.quantity}
              updatedQuantity={onUpdatedQuantity}
              maxValue={product.inStock > 5 ? 5 : product.inStock} //product.inStock
              />
              <SizeSelector
                selectedSize={tempCartProduct.size}
                sizes={product.sizes}
                onselectedSize={selectSize}

                />
            </Box>
            {/* agregar al carrito */}
            {product.inStock > 0 ? (
              <Button color="secondary" className="circular-btn"
              onClick={onAddProduct}
              >
                {
                  tempCartProduct.quantity <= 0 ? 'Especifique la cantidad del producto':
                  tempCartProduct.size ? 'Agregar al carrito': 'Seleccione una talla'
                }
              </Button>
            ) : (
              <Chip
                color="error"
                label="no hay disponibles"
                variant="outlined"
              />
            )}
            {/* <Chip label='No hay disponibles' color="error" variant="outlined"/> */}
            {/* descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripcion</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

//getserversideprops

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { slug = "" } = query as { slug: string };
//   const product = await dbProducts.getProductsByslug(slug); // your fetch function here

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       product,
//     },
//   };
// };
//getstaticpaths
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const paths = await dbProducts.getAllProductsSlugs();

  return {
    paths: paths.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
};

//getStaticProps

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };

  const product = await dbProducts.getProductsByslug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 86400,
  };
};

export default ProductPage;
