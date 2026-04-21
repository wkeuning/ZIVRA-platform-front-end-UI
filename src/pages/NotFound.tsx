import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="mb-4">404</h1>
      <p className="mb-6">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button className="w-full bg-[#4C45FC] text-white p-3 rounded-xl">
            Back to dashboard
        </Button>
        </Link>
    </div>
  );
}
