import type { Metadata } from "next";
import BlogPage from "../pages/blog/BlogPage";

export const metadata: Metadata = {
  title: "The Garikai Journal | Student Accommodation Advice",
  description:
    "Practical, human guidance for students searching for accommodation and property providers welcoming tenants in Zimbabwe.",
};

export default function Blog() {
  return <BlogPage />;
}
