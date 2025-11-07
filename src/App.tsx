"use client";

import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Footer from "@/components/ui/footer";

// ✅ Import your Firebase Firestore instance
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "artifacts/afimah-store/products"));
        console.log(
          "✅ Firebase connected successfully! Documents in 'products':",
          querySnapshot.size
        );
      } catch (error) {
        console.error("❌ Firebase connection error:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
