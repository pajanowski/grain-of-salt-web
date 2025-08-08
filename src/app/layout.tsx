import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {RecipeService} from "@/app/service/recipe.service";
import {NEAPOLITAN, NY_STYLE, PAPA_JOHNS} from "@/app/static-data.pizza";
import {Suspense, useMemo} from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grain of Salt",
  description: "Recipe app with version control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    useMemo(() => {
       loadTestData();
    }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
            {children}
        </Suspense>
      </body>
    </html>
  );
}

const loadTestData = () => {
    RecipeService.saveRootRecipe(NEAPOLITAN);
    RecipeService.saveRecipeNode(NY_STYLE);
    RecipeService.saveRecipeNode(PAPA_JOHNS);
}
