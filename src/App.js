import Home from "./components/Home";
import Menu from "./components/Menu";
import Orders from "./components/Orders";
import Agents from "./components/Agents";
import Reports from "./components/Reports";
import DistributorSignup from "./components/DistributorSignup";
import DistributorSignin from "./components/DistributorSignin";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";


const App=()=> {
  return (
    <BrowserRouter>
       <Routes>
         <Route path="/signup" element={<DistributorSignup/>}/>
         <Route path="/signin" element={<DistributorSignin/>}/>
         <Route element={<Home/>}>
           <Route index element={<Menu/>}/>
           <Route path="/orders" element={<Orders/>}/>
           <Route path="/agents" element={<Agents/>}/>
           <Route path="/reports" element={<Reports/>}/>
         </Route>

       </Routes>
    </BrowserRouter>
    
  );
}

export default App;