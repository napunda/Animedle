import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useConfigStore } from "@/stores/ConfigState";
import { useEffect } from "react";
import { useGameStore } from "@/stores/GameState";

export const Layout = () => {
  const { content, isLoading, isError, fetchData } = useConfigStore();
  const { start, isLoading: isLoadingGame } = useGameStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (content && !isLoading && !isError && isLoadingGame) {
      document.title = content.name ?? "Animedle";
    }
  }, [content, isLoading, isError, isLoadingGame]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
