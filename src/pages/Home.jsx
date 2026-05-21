import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import CategoryGrid from "../components/CategoryGrid";
import FeaturedProducts from "../components/FeaturedProducts";
import TrustBar from "../components/TrustBar";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryGrid />
      <FeaturedProducts />
      <TrustBar />
      <Testimonials />
    </>
  );
}
