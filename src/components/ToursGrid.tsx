import { TourCard } from "@/components/Experiences";
import { TOURS_DATA } from "@/data/tours";

const ToursGrid = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
      {TOURS_DATA.map((tour, index) => (
        <TourCard key={index} {...tour} />
      ))}
    </div>
  );
};

export default ToursGrid;
