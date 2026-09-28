import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

class ErrorBoundaryInner extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) {
    console.error("CarePulse Boundary caught an error:", err, info);
  }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2">Reload the page. If it keeps happening, clear this site's data in your browser settings.</p>
        <button className="btn mt-4" onClick={() => location.reload()}>Reload</button>
      </div>
    );
  }
}

function Boundary({ children }) {
  const location = useLocation();
  return <ErrorBoundaryInner key={location.pathname}>{children}</ErrorBoundaryInner>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Boundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Boundary>
  </BrowserRouter>
);
