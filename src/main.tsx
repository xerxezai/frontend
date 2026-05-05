import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./styles/bootstrap/bootstrap.min.css";
import "./styles/fontawesome/font-awesome.css";
import "./styles/scss/main.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ContextProvider } from "./context/context.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ContextProvider>
      <App />
      <ToastContainer />
    </ContextProvider>
  </StrictMode>
);
