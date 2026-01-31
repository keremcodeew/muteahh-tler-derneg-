import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BannerSlider from './components/BannerSlider';
import Announcements from './components/Announcements';
import Projects from './components/Projects';
import MembershipCTA from './components/MembershipCTA';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BannerSlider />
        <Announcements />
        <Projects />
        <MembershipCTA />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
