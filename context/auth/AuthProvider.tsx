import { FC, useReducer, PropsWithChildren, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

import axios from "axios";
import Cookies from "js-cookie";
import { tesloAPI } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface AuthState {
  isLogIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLogIn: false,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[AUTH] - login", payload: data.user as IUser });
    }
  }, [status, data]);
  // useEffect(() => {
  //   checkToken()
  // }, [])

  const checkToken = async () => {
    if (!Cookies.get("token")) return;
    //llamar endpoint
    try {
      const { data } = await tesloAPI.get("user/validate-token");
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[AUTH] - login", payload: user });
      return true;
    } catch (error) {
      Cookies.remove("token");
      return false;
    }
    //revalidar token guardado
    //dispatch login
    //borrar token de las cookies
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloAPI.post("user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[AUTH] - login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };
  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloAPI.post("user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[AUTH] - login", payload: user });
      return { hasError: false };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string };
        return {
          hasError: true,
          message,
        };
      }
      return {
        hasError: true,
        message: "no se pudo crear el usuario, intente de nuevo",
      };
    }
  };

  const logoOut = () => {
    Cookies.remove("cart");
    Cookies.remove("fistName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");
    signOut()
    // router.reload();
    // Cookies.remove("token");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        //methods
        loginUser,
        registerUser,
        logoOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
