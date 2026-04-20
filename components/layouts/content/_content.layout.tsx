"use client";
import React from "react";
import { ContentNavabr } from "./_content.navbar";

export const ContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[1000px] w-screen  relative">
      <ContentNavabr />
      <main className="w-5xl mx-auto my-6">{children}</main>
    </div>
  );
};
