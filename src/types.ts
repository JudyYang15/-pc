export interface Article {
  id: string;
  title: string;
  category: "Technology" | "Finance" | "Lifestyle" | "Sports" | "Health" | "Humanities";
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  likes: number;
  views: number;
}

export type TriggerBehavior = "hover" | "click" | "swipe-left-to-right";

export interface SimulatorConfig {
  touchZoneWidth: number; // in pixels (e.g. 15 to 50)
  showIndicator: boolean;
  triggerBehavior: TriggerBehavior;
  indicatorColor: string;
  activeArticleId: string;
}
