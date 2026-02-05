import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experiences from "@/components/Experiences";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Wine Tours Valparaíso | Premium Chilean Wine Experiences"
        description="Discover Chile's finest vineyards with expert-led tours through Casablanca Valley. World-class wine tastings and unforgettable experiences."
        canonicalUrl="https://winetoursvalparaiso.com"
      />
      <Header />
      <Hero />
      <About />
      <Experiences />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
