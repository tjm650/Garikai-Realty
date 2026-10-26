"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";

const articles = [
  {
    id: "finding-your-place",
    category: "FOR STUDENTS",
    readTime: "4 min read",
    title: "Finding a place to stay should feel hopeful, not overwhelming",
    intro:
      "A new school year can bring enough change on its own. Start your accommodation search with a few clear priorities, and give yourself room to ask questions.",
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=85",
    alt: "Students walking together across a university campus",
    tips: [
      "Set a realistic budget that includes transport, utilities and other regular costs.",
      "Think about the daily journey to campus, shops and the people you rely on.",
      "Ask what is included in the rent, who you will share spaces with and how availability is confirmed.",
      "Visit where possible, verify the details and never feel pressured to pay before you are comfortable.",
    ],
  },
  {
    id: "prepare-your-property",
    category: "FOR PROPERTY PROVIDERS",
    readTime: "3 min read",
    title: "Help the right tenants picture themselves at your property",
    intro:
      "A thoughtful listing does more than advertise a room. It helps a student understand what everyday life there could look like and whether it fits their needs.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    alt: "A bright, welcoming living space prepared for residents",
    tips: [
      "Use recent, clear photos that honestly represent the rooms and shared spaces.",
      "State the rent, location, amenities, occupancy and availability clearly.",
      "Explain any house rules or extra costs early, so expectations are fair on both sides.",
      "Keep availability up to date and respond to enquiries with patience and respect.",
    ],
  },
  {
    id: "questions-before-committing",
    category: "PRACTICAL GUIDANCE",
    readTime: "3 min read",
    title: "Questions worth asking before you commit to a room",
    intro:
      "It is easy to focus on the monthly price when a room looks right. A few calm, practical questions can help you understand the full picture before making a decision.",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85",
    alt: "A welcoming residential building in daylight",
    tips: [
      "What is the total amount due upfront, and are there any additional charges?",
      "What furniture, utilities, internet access and facilities are included?",
      "How are repairs, security concerns and other issues reported?",
      "What are the payment arrangements, house rules and terms for leaving?",
    ],
  },
];

const BlogPage: React.FC = () => (
  <main className="min-h-screen bg-[#f7f2e8] text-gray-800">
    <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-4 inline-flex rounded-full border border-[#1F4788]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1F4788]">
            THE GARIKAI JOURNAL
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#1F4788] sm:text-5xl lg:text-6xl">
            A little guidance for finding your place.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-700">
            Moving, renting or welcoming someone into your property is about
            more than a room and a price. We share practical advice to help
            students and property providers make informed decisions with more
            confidence and less stress.
          </p>
          <a
            href="#latest-stories"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#1F4788] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#173866]"
          >
            Explore the journal
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] border-8 border-white/80 bg-white shadow-xl shadow-[#1F4788]/10">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"
              alt="Friends sharing a relaxed moment outdoors"
              className="h-[280px] w-full object-cover sm:h-[390px]"
            />
            <div className="p-5 sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#C2410C]">
                More than a listing
              </p>
              <p className="mt-2 text-xl font-semibold leading-snug text-[#1F4788]">
                Better decisions begin with clear information and a human
                conversation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <section id="latest-stories" className="bg-white/70 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C2410C]">
            Read, prepare, feel more confident
          </p>
          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#1F4788] sm:text-4xl">
            Useful advice for real-life decisions
          </h2>
          <p className="mt-4 leading-7 text-gray-600">
            Whether you are searching for your first student room or looking
            after a property, start with the guidance that feels most relevant
            to you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="overflow-hidden rounded-3xl border border-[#1F4788]/10 bg-white shadow-sm transition-shadow hover:shadow-lg hover:shadow-[#1F4788]/10"
            >
              <img
                src={article.image}
                alt={article.alt}
                className="h-52 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold tracking-wide text-[#C2410C]">
                  <span>{article.category}</span>
                  <span className="text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold leading-snug text-[#1F4788]">
                  {article.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">{article.intro}</p>
                <a
                  href={`#${article.id}`}
                  className="mt-5 inline-flex items-center font-semibold text-[#1F4788] underline decoration-[#7494c8] underline-offset-4 hover:text-[#C2410C]"
                >
                  Read the guide <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            id={article.id}
            className="scroll-mt-24 rounded-3xl border border-[#1F4788]/10 bg-white p-6 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.14em] text-[#C2410C]">
              {article.category}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-[#1F4788]">
              {article.title}
            </h2>
            <p className="mt-4 leading-7 text-gray-600">{article.intro}</p>
            <ul className="mt-5 space-y-3">
              {article.tips.map((tip) => (
                <li key={tip} className="flex gap-3 leading-6 text-gray-700">
                  <span className="mt-1 font-bold text-[#C2410C]" aria-hidden="true">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>

    <section className="px-5 pb-14 sm:px-8 sm:pb-20 lg:px-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1F4788] px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="grid items-center gap-7 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/75">
              Your next step
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              You do not have to figure everything out at once.
            </h2>
            <p className="mt-4 leading-7 text-white/85">
              Take your time, ask the questions that matter and make decisions
              when you feel informed. Garikai Realty is here to help make the
              accommodation journey clearer for students and providers.
            </p>
          </div>
          <Link
            href="/why-us"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-[#1F4788] transition-colors hover:bg-[#f7f2e8]"
          >
            Get to know Garikai
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default BlogPage;
