import "./globals.css";
import Footer from "./Footer";
import Navbar from "./Navbar";

export const metadata = {
  title: "SafeGuard — Child Safety System",
  description:
    "IoT-based child safety & anti-kidnapping system with real-time GPS tracking, health monitoring, and smart alerts.",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
