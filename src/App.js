import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Create from "./pages/Create";
import Login from "./pages/Login";
import PrivateRoute from "./router/PrivateRoute";
export default function App() {
  return (
    <Router>
      <Switch>
        {/* Private Route for /create */}
        <PrivateRoute exact path="/create" component={Create} />

        {/* Public Route for /login */}
        <Route exact path="/login" component={Login} />

        {/* Redirect any other route to /login */}
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}
