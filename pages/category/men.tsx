import { Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";



const MenPage: NextPage = () => {

  const { products, isError, isLoading} = useProducts('products?gender=men');

  return (
    <ShopLayout title={"Teslo - shop - men"} pageDescrition={"Productos de Hombre"}>
      <Typography variant="h1" component={"h1"}>
        Hombres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos para Hombres
      </Typography>
      {
        isLoading ? <FullScreenLoading/>: <ProductList products={products}/>
      }
      
    </ShopLayout>
  );
};

export default MenPage;