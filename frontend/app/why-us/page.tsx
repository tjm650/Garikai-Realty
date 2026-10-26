import type { Metadata } from "next";
import WhyUsPage from "../pages/why-us/WhyUsPage";

export const metadata: Metadata = {
  title: "Why Garikai Realty | Accommodation made more human",
  description:
    "Discover how Garikai Realty helps students find suitable accommodation and helps property providers connect with students in Zimbabwe.",
};

export default function WhyUs() {
  return <WhyUsPage />;
}
