import Header from './Header';
import LeftSidebar from './LeftSidebar';
import Content from './Content';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <Content />
      </div>
      <Footer />
    </div>
  );
}

