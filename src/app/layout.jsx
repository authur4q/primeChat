
import { AuthProvider } from "../../provider";
import "./globals.css";


export const metadata = {
  title: "primeChat",
  description: "PrimeChat is a fast, secure, and user-friendly messaging app built with Next.js, allowing you to connect, chat, and share with friends in real time.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
