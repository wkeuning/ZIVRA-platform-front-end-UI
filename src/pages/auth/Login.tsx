import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import logo from "@/assets/logo.svg";
import { useAuthService } from "@/services/auth/AuthService";
import Spinner from "@/components/ui/spinner";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthService();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      onLogin();
      navigate("/");
    }
  }, [navigate, onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      onLogin();
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      {loading && (
        <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center z-10">
          <Spinner />
        </div>
      )}
      <div className="w-full max-w-md flex flex-wrap justify-center">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 mx-4 py-3 rounded-2xl relative mb-4 w-96 w-full">
            {error}
          </div>
        )}
        <Card>
          <CardHeader>
            <img src={logo} alt="ZIVRA_Logo" className="mx-auto" />
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <Input
                type="email"
                placeholder="Email"
                className="p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                className="p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full bg-[#4C45FC] text-white p-3 rounded-xl">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}