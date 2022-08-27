import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";
import { NextPage } from 'next';



const WomenPage: NextPage = () => {

  const { products, isError, isLoading} = useProducts('products?gender=women');

  return (
    <ShopLayout title={"Teslo - shop - Women"} pageDescrition={"Productos de Mujer"}>
      <Typography variant="h1" component={"h1"}>
        Mujeres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos para Mujeres
      </Typography>
      {
        isLoading ? <FullScreenLoading/>: <ProductList products={products}/>
      }
      
    </ShopLayout>
  );
};

export default WomenPage;