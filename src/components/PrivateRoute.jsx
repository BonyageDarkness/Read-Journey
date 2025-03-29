import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSelectors";

export default function PrivateRoute({ children }) {
  const token = useSelector(selectToken);

  return token ? children : <Navigate to="/signin" replace />;
}
