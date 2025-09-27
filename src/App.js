import Home from "./components/Home";
import Menu from "./components/Menu";
import Orders from "./components/Orders";
import Agents from "./components/Agents";
import Reports from "./components/Reports";
import DistributorSignin from "./components/DistributorSignin";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";


const App=()=> {
  return (
    <BrowserRouter>
       <Routes>
         <Route path="/" element={<DistributorSignin/>}/>
         <Route element={<Home/>}>
           <Route path="/products" element={<Menu/>}/>
           <Route path="/orders" element={<Orders/>}/>
           <Route path="/agents" element={<Agents/>}/>
           <Route path="/reports" element={<Reports/>}/>
         </Route>
         
       </Routes>
    </BrowserRouter>
    
  );
}

export default App;