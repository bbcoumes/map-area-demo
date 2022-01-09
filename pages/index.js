import { MapView } from "../components/map";

function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen py-2 space-y-2">
      <p className="font-bold">Solar Calculator</p>
      <MapView />
    </div>
  );
}

export default HomePage;
