import "./App.css";
import { AuthProvider } from "./context/authContext";
import AppRoutes from "./routes/appRoutes";

function App() {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </>
  );
}

export default App;
