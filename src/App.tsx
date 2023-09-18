import React from "react";
import "./App.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Products from "./components/Products";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Products />
    </QueryClientProvider>
  );
}

export default App;
