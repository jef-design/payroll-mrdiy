import { Outlet } from "react-router-dom"
import Header from "../layout/Header"

const Home = () => {
  return (
    <div>
        <Header/>
        <Outlet/>
    </div>

  )
}

export default Home