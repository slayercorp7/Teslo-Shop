import { AuthState } from "./";
import { IUser } from "../../interfaces";

type AuthType =
  | { type: "[AUTH] - login", payload: IUser }
  | { type: "[AUTH] - logout" };

export const authReducer = (state: AuthState, action: AuthType): AuthState => {
  switch (action.type) {
    case "[AUTH] - login":
      return {
        ...state,
        isLogIn: true,
        user: action.payload,
      };
    case "[AUTH] - logout":
      return {
        ...state,
        isLogIn: false,
        user: undefined,
      };

    default:
      return state;
  }
};
