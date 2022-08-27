import { Typography } from "@mui/material";
import { NextPage } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";



const KidPage: NextPage = () => {

  const { products, isError, isLoading} = useProducts('products?gender=kid');

  return (
    <ShopLayout title={"Teslo - shop - Kid "} pageDescrition={"Productos para Niños"}>
      <Typography variant="h1" component={"h1"}>
        Niños
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos para niños
      </Typography>
      {
        isLoading ? <FullScreenLoading/>: <ProductList products={products}/>
      }
      
    </ShopLayout>
  );
};

export default KidPage;