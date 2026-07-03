"use client";

import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import Navbar from "./Navbar";
import HomeClient from "./HomeClient";
import Footer from "./Footer";

type Ad = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  pricePerDay: number;
  advertiser: { name: string; companyName: string | null; avatarUrl: string | null };
  eligibleModels: { brand: string; model: string }[];
};

type Props = {
  role?: string | null;
  ads: Ad[];
  initialBrand: string | null;
  initialModel: string | null;
  isLoggedIn: boolean;
};

export default function HomeShell({ role, ads, initialBrand, initialModel, isLoggedIn }: Props) {
  return (
    <LocaleProvider>
      <Navbar role={role} />
      <HomeClient
        ads={ads}
        initialBrand={initialBrand}
        initialModel={initialModel}
        isLoggedIn={isLoggedIn}
      />
      <Footer />
    </LocaleProvider>
  );
}
