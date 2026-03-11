import fs from "fs";
import path from "path";

const newsDirectory = path.join(process.cwd(), "content/news");

export interface NewsItem {
  _id: string;
  source: string;
  title: string;
  title_es: string;
  bajada: string;
  categoria: string;
  link: string;
  published: string;
  _scraped_at: string;
}

export interface DayNews {
  date: string;
  items: NewsItem[];
}

export function getAllDays(): DayNews[] {
  if (!fs.existsSync(newsDirectory)) return [];

  const files = fs
    .readdirSync(newsDirectory)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();

  return files.map((file) => {
    const dateStr = file.replace(/\.json$/, "");
    const fullPath = path.join(newsDirectory, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const items: NewsItem[] = JSON.parse(content);
    return { date: dateStr, items };
  });
}

export function getNewsByDate(dateStr: string): NewsItem[] {
  const fullPath = path.join(newsDirectory, `${dateStr}.json`);
  if (!fs.existsSync(fullPath)) return [];
  const content = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(content);
}

export function getAllDates(): string[] {
  if (!fs.existsSync(newsDirectory)) return [];
  return fs
    .readdirSync(newsDirectory)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort()
    .reverse();
}
