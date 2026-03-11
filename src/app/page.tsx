import { getAllDays } from "@/lib/news";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  const days = getAllDays();
  return <HomeContent days={days} />;
}
