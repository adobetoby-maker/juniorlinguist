import WeeklySignup from "../components/WeeklySignup";
import { displayFont, sansFont, PURPLE } from "../constants";

export default function FreeDownloads() {
  return (
    <main style={{ paddingTop: 112 }}>
      <header className="max-w-4xl mx-auto px-6" style={sansFont}>
        <h1 className="text-4xl font-bold mb-5" style={displayFont}>
          Weekly practice for curious families
        </h1>
        <p className="text-lg leading-relaxed mb-5">
          Explore Junior Linguist topics now, and check below for a free family
          study guide and weekly parent or homeschool lessons. Sign up using an
          adult email.
        </p>
        <a href="/#modules" className="font-semibold" style={{ color: PURPLE }}>
          Browse Junior Linguist topics →
        </a>
      </header>
      <WeeklySignup directDownload />
    </main>
  );
}
