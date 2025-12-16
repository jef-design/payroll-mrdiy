import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./pages/Home";
import LeavePage from "./pages/LeavePage";
import SignUp from "./pages/SignUp";
import VerificationEmail from "./pages/VerificationEmail";
function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    path: "/leave",
                    element: <LeavePage />,
                },
              {
                path: 'signup',
                element: <SignUp/>
              },
               {
                path: 'verify-email',
                element: <VerificationEmail/>
              }
            ],
        },
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
