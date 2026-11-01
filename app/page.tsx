import Features from "@/components/home/Features";
import Gallery from "@/components/home/Gallery";
import Hero from "@/components/home/Hero";
import Newsletter from "@/components/home/Newsletter";
import UpcomingEvents from "@/components/home/UpcomingEvents";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <UpcomingEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
