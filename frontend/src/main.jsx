import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import Review from './pages/Review.jsx'
import Login from './pages/Login.jsx'
import './index.css'
import HomeAppBar from './components/HomeAppBar.jsx';
import CreateAccount from './pages/CreateAccount.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import { UserContextProvider } from './components/UserContext.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<HomeAppBar />}>
            <Route index element={<Home/>} />
            <Route path="home" element={<Home />} />
            <Route path="review" element={<Review />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<CreateAccount />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
