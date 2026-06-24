"use client";
// Shared dashboard context — lets child pages (e.g. Settings) update the
// profile the layout's sidebar/header render, so changes show up instantly.
import { createContext, useContext } from "react";

export const DashboardContext = createContext({
  user: null,
  setUser: () => {},
});

export const useDashboard = () => useContext(DashboardContext);
