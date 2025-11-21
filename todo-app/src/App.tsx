import "./App.css";

import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { AboutPage } from "./pages/aboutPage";
import { Layout } from "./layout/layout";
import { TodosPage } from "./pages/todosPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="todos" element={<TodosPage />} />
      </Route>
    </Routes>
  );
}
