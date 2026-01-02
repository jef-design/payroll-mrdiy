import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import LeavePage from "./pages/LeavePage";
import SignUp from "./pages/SignUp";
import VerificationEmail from "./pages/VerificationEmail";
import AddPasswordtoAccount from "./pages/AddPasswordtoAccount";
import ProtectedRoutes from "./pages/ProtectRoutes";
import EmployeeProfile from "./pages/EmployeeProfile";
import RequestSuccess from "./pages/RequestSuccess";
import SignIn from "./pages/SignIn";
import { useStore } from "./services/useStore";
function App() {
    const {user} = useStore()
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },
        {
            element: <ProtectedRoutes />,
            children: [
                {
                    path: "/leave",
                    element: <LeavePage />,
                },
                {
                    path: "/employee/profile",
                    element: !user ? <Navigate to={'/signin'}/> : <EmployeeProfile/>
                },
                 {
                    path: "/leave/success",
                    element: <RequestSuccess/>
                }
            ],
        },
        {
            path: "/signup",
            element: <SignUp />,
        },
         {
            path: "/signin",
            element: <SignIn />,
        },
        {
            path: "/verify-email",
            element: <VerificationEmail />,
        },
        {
            path: "/password-update",
            element: <AddPasswordtoAccount />,
        },
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
