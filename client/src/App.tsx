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
import {useStore} from "./services/useStore";
import LeaveLists from "./pages/leaveLists";
function App() {
    const {user} = useStore();
    const router = createBrowserRouter([
        {
            element: <ProtectedRoutes />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/leave",
                    element: <LeavePage />,
                },
                {
                    path: "/employee/profile",
                    element: !user ? <Navigate to={"/signin"} /> : <EmployeeProfile />,
                },
                {
                    path: "/leave/success",
                    element: <RequestSuccess />,
                },
                {
                    path: "/leave/history",
                    element: <LeaveLists />,
                },
            ],
        },

        {
            path: "/signup",
            element: !user ? <SignUp /> : <Navigate to={'/employee/profile'} />,
        },
        {
            path: "/signin",
            element: !user ? <SignIn /> : <Navigate to={'/employee/profile'} />,
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
