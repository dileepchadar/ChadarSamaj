import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ["latin"] });


export const metadata = {
  title: "Simple Matrimony",
  description: "Built for Community.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-gray-800 text-white text-center p-6 mt-10">
              <p>&copy; 2026 Simple Matrimony. Built for Community.</p>
            </footer>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
