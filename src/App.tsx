import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/Books";
import BookDetails from "./pages/BooksDetails";
import UsersPage from "./pages/Users";
import { useAuth } from "./contexts/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route path="users" element={<UsersPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:id" element={<BookDetails />} />
        <Route path="*" element={<Navigate to="/books" />} />
      </Route>
    </Routes>
  );
}

/* 
import { Switch, Route, Redirect } from "wouter";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import BooksPage from "@/pages/Books";
import BookDetails from "@/pages/BooksDetails";
import UsersPage from "@/pages/Users";
import { useAuth } from "@/contexts/AuthContext";
import type { JSX } from "react";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Redirect to="/login" />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route path="/books">
        <PrivateRoute>
          <Dashboard>
            <BooksPage />
          </Dashboard>
        </PrivateRoute>
      </Route>

      <Route path="/books/:id">
        <PrivateRoute>
          <Dashboard>
            <BookDetails />
          </Dashboard>
        </PrivateRoute>
      </Route>

      <Route path="/users">
        <PrivateRoute>
          <Dashboard>
            <UsersPage />
          </Dashboard>
        </PrivateRoute>
      </Route>

      <Route>
        <Redirect to="/books" />
      </Route>
    </Switch>
  );
} */
