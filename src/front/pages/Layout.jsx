import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Layout({ children }) {
  return (
    <ScrollToTop>
      <Navbar />
      {children}            
      <Footer />
    </ScrollToTop>
  );
}
