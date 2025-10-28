import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

// El Layout contiene el navbar y el footer, el children es el contenido de la pagina
export default function Layout({ children }) {
  return (
    <ScrollToTop>
      <Navbar />
      {children}
      <Footer />
    </ScrollToTop>
  );
}
