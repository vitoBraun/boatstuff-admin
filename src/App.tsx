import React from "react";
import "./App.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Products from "./pages/Products";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import EditProductPage from "./pages/EditProductPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();


function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id?" element={<EditProductPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
