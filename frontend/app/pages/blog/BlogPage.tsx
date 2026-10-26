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
         
          <h1 className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-6">
            A little guidance for finding your place.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-md">
            Moving, renting or welcoming someone into your property is about
            more than a room and a price. We share practical advice to help
            students and property providers make informed decisions with more
            confidence and less stress.
          </p>
          <a
            href="#latest-stories"
            className="inline-flex min-h-12 mt-5 items-center justify-center border  hover:border-[#C2410C] border-gray-700 rounded-full px-6 py-3 font-normal text-gray-700 transition-colors duration-500 hover:bg-gray-700 hover:text-white"
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
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-[#1F4788]/10">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85"
              alt="Friends sharing a relaxed moment outdoors"
              className="h-[280px] w-full object-cover sm:h-[390px]"
            />
           
          </div>
        </motion.div>
      </div>
    </section>

    <section id="latest-stories" className=" py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-9 max-w-2xl">
         
          <h2 className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-6">
            Useful advice for real-life decisions
          </h2>
          <p className="text-lg md:text-xl text-gray-700 ">
            Whether you are searching for first student room or looking after a property, start with the guidance that feels most relevant to you.
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
              className="overflow-hidden rounded-3xl border border-[#C2410C]/20 bg-white/30 transition-shadow hover:shadow-lg hover:shadow-[#1F4788]/10"
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
                <h3 className="mt-4 text-xl font-bold leading-snug text-gray-600">
                  {article.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">{article.intro}</p>
                <a
                  href={`#${article.id}`}
                  className="mt-5 inline-flex items-center font-normal text-[#7494c8] underline decoration-[#7494c8] underline-offset-4"
                >
                  Read the guide <span className="ml-2" aria-hidden="true">→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-20 lg:px-10">
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
            <h2 className="mt-3 text-2xl font-bold leading-snug text-gray-600">
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


     <section className="px-5 pb-6 sm:px-8 sm:pb-10 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div>
              <p className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-3">
                Looking for Accommodation?
              </p>
              <p className="text-lg md:text-xl text-gray-700 max-w-md">
                Start a conversation, share what you need, and get clarity on
                the details that matter to you.
              </p>
            </div>
           

             <a
            href={process.env.JEFF_WA_NUMBER}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border-0 border-gray-700 bg-transparent px-2 py-2 text-sm font-medium text-gray-700 hover:text-white transition-colors duration-500 md:col-start-5 md:row-start-1 md:border md:px-4 hover:bg-gray-700 hover:border-[#C2410C]`}
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.173-1.289-.025-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="hidden md:inline">Talk to Garikai</span>
          </a>
          </div>
        </div>
      </section>
  </main>
);

export default BlogPage;
