import { useState, useContext } from "react";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { AuthContext } from "../../context";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const router = useRouter();

  const { registerUser } = useContext(AuthContext);

  const onRegisterForm = async ({ email, name, password }: FormData) => {
    setShowError(false);

    const { hasError, message } = await registerUser(name, email, password);

    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);
    await signIn('credentials', {email, password})
  };
  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear Cuenta
              </Typography>
              <Chip
                label="Algo a salido mal... intenta de nuevo"
                color="error"
                icon={<ErrorOutlineOutlined />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre Completo"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "campo requerido",
                  minLength: {
                    value: 3,
                    message: "el nombre debe ser de minimo 3 caracteres",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Campo Requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "campo requerido",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Registrar
              </Button>
            </Grid>
            <Grid
              container
              item
              xs={12}
              display="flex"
              justifyContent="start"
              flexDirection="column"
            >
              <Grid item>
                <Typography>¿Ya tienes Cuenta?</Typography>
              </Grid>
              <Grid item sx={{ mt: "10px" }}>
                <NextLink href={ router.query.p ? `/auth/login?p=${ router.query.p }`: '/auth/login' } passHref>
                  <Link>
                    <Button color="secondary" fullWidth>
                      {" "}
                      Iniciar Sesión{" "}
                    </Button>
                  </Link>
                </NextLink>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

  const session = await getSession({req})

  const {p = '/'} = query;

  if(session){
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }
  return {
    props: {
      
    }
  }
}

export default RegisterPage;
