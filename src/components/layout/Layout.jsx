import Header from './Header';
import Footer from './Footer';
import './layout.css';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
