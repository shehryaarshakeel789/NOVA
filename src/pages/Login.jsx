import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth";
import { useAuth } from "@/context/AuthContext.jsx";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
      await refetchUser();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-md bg-primary-foreground px-10 py-10 rounded-xl "
      >
        <h1 className="text-2xl font-bold text-center mb-2">Log In</h1>
        <div>
          <p>Email</p>
          <input
            id="email"
            type="text"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <p>Password</p>
          <input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <button type="submit" className="bg-black text-white rounded-full py-2">
          Login
        </button>
        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
