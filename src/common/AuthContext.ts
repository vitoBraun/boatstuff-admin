import { createContext, useContext } from "react";

const initialAuthContext = {
  eamil: "test",
  looged: false,
};
export const AuthContext = createContext(initialAuthContext);
// Create the custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
