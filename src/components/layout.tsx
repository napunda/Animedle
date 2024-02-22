import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useConfigStore } from "@/stores/ConfigState";
import { useEffect } from "react";

export const Layout = () => {
  const { content, isLoading, isError, fetchData } = useConfigStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (content && !isLoading && !isError) {
      document.title = content.name ?? "Animedle";
    }
  }, [content, isLoading, isError]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
