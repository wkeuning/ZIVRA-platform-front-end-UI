import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }){
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-96 mx-4 w-full">
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function CardContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function AuthCard({ children }: { children: ReactNode }) {
  return <Card>{children}</Card>;
}
