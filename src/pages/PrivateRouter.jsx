import { Navigate, Outlet, Route, useLocation, useSearchParams } from "react-router-dom";
import useAuth from "../stores/useAuth";

const PrivateRoute = (props) => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const setRedirection = useAuth(state => state.setRedirection);
    const auth = useAuth(state => state.auth);

    //   if (authStore.isLoadingAuth) {
    //     return <div>Checking auth...</div>;
    //   }
    // console.log(location)
    // console.log(searchParams.toString())
    if (auth) {
        return <Outlet />
    } else {
        setRedirection(location.pathname + '?' + searchParams.toString())
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;