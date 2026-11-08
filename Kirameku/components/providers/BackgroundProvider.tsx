"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { siteConfig } from "@/siteConfig";

interface BackgroundContextType {
  bgImage: string;
  bgBlur: number;
  setBgImage: (img: string) => void;
  setBgBlur: (blur: number) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  bgImage: "",
  bgBlur: 0,
  setBgImage: () => {},
  setBgBlur: () => {},
});

export function useBackground() {
  return useContext(BackgroundContext);
}

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [bgImage, setBgImage] = useState("");
  const [bgBlur, setBgBlur] = useState(20);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedImg = localStorage.getItem("bg-image");
    const savedBlur = localStorage.getItem("bg-blur");
    const defaultVersion = localStorage.getItem("bg-default-version");

    // 上一版默认背景会自动写入本地存储，迁移一次后仍保留用户后续的选择。
    if (defaultVersion !== "2" && savedImg === "/images/wan-bg-08.png") {
      setBgImage(siteConfig.defaultBgImage);
    } else if (savedImg && siteConfig.bgImages.includes(savedImg)) {
      setBgImage(savedImg);
    } else {
      setBgImage(siteConfig.defaultBgImage);
    }
    localStorage.setItem("bg-default-version", "2");

    setBgBlur(savedBlur ? Number(savedBlur) : 20);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("bg-image", bgImage);
    }
  }, [bgImage, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("bg-blur", String(bgBlur));
    }
  }, [bgBlur, mounted]);

  if (!mounted) return null;

  return (
    <BackgroundContext.Provider value={{ bgImage, bgBlur, setBgImage, setBgBlur }}>
      {children}
    </BackgroundContext.Provider>
  );
}
