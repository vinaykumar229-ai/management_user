import React from "react";
import UserTable from "./components/UserTable";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management</h1>
      </header>

      <main>
        <UserTable />
      </main>
    </div>
  );
}
