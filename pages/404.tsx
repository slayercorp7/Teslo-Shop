import { Box, Typography, IconButton } from '@mui/material';
import { ShopLayout } from "../components/layouts/ShopLayout";
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

const Custom404 = () => {
  return (
    <ShopLayout
      title={"Page not Found"}
      pageDescrition={"no se encontro el contenido"}
    >
      <Box
        display={{xs: 'grid', md: 'flex'}}
        justifyContent="center"
        alignItems={"center"}
        height="calc(100vh - 200px)"
      >
        <IconButton size='large' color='error' sx={{ width: '100px', height: '100px'}}>
            <ReportOutlinedIcon sx={{fontSize: 60}}/>
        </IconButton>
        <Typography
          variant="h1"
          component={"h1"}
          fontSize={80}
          fontWeight={200}
        >
          404 |
        </Typography>
        <Typography marginLeft={2}> No encontramos una pagina con ese nombre</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
