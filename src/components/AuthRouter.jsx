import { Navigate } from "react-router-dom";

import { getLocalStorageToken } from "@/utils";

function AuthRouter({ children }) {
  const token = getLocalStorageToken();
  if (token) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" replace />;
  }
}
export default AuthRouter;
