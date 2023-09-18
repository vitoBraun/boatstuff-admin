import React from "react";
import "./App.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Products from "./components/Products";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductCreate from "./components/ProductCreate";
import Home from "./components/Home";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/createProduct" element={<ProductCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
