"use client";

import React from "react";
import { motion } from "motion/react";

const benefits = [
  {
    number: "01",
    title: "A better start for students",
    text: "Finding a place to stay should feel like the beginning of an exciting chapter, not another source of stress. Explore accommodation options that fit your needs, budget and everyday routine.",
  },
  {
    number: "02",
    title: "More visibility for property providers",
    text: "Your property deserves to be seen by the people who need it. Garikai Realty helps providers present their accommodation clearly and connect with students actively looking for a place to call home.",
  },
  {
    number: "03",
    title: "Clear information. Better decisions.",
    text: "Understand the details that matter before taking the next step: rental price, room availability, location and amenities. Clear information helps students compare options and helps providers set expectations.",
  },
  {
    number: "04",
    title: "Real people, respectful support",
    text: "Every search is personal. Whether you are moving for school or managing a property, we aim to make the process easier to understand, easier to navigate and more human.",
  },
];

const steps = [
  {
    title: "Tell us what you need",
    text: "Students can share their preferred area, budget, group size and accommodation needs. Providers can showcase their property and availability.",
  },
  {
    title: "Explore suitable options",
    text: "Compare the details that matter to you, ask questions and narrow your choices without losing sight of your priorities.",
  },
  {
    title: "Connect and confirm",
    text: "Talk through the details directly and confirm arrangements with the property provider before making a commitment.",
  },
];

const WhyUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-gray-800">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <p className="mb-4 inline-flex rounded-full border border-[#1F4788]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#1F4788]">
              A more human way to find a place to stay
            </p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-[#1F4788] sm:text-5xl lg:text-6xl">
              A place to live. A little more peace of mind.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-700">
              Moving for school, looking for a room, or welcoming new tenants
              into your property is a big deal. Garikai Realty brings students
              and property providers closer with clearer information and a
              simpler way to get started.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={process.env.JEFF_WA_NUMBER || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1F4788] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#173866]"
              >
                Find accommodation
              </a>
              <a
                href={process.env.HELP_CENTER_WA_NUMBER || "/"}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#1F4788]/40 bg-white/70 px-6 py-3 font-semibold text-[#1F4788] transition-colors hover:bg-white"
              >
                I have a property
              </a>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-500">
              Take your time, ask questions and confirm the details directly
              with the provider. Never pay or commit before you are comfortable
              with the arrangements.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-[#7494c8]/25 blur-2xl" />
            <div className="absolute -bottom-5 right-2 h-32 w-32 rounded-full bg-[#C2410C]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white p-2 shadow-xl shadow-[#1F4788]/10">
              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85"
                alt="University students sharing a positive moment on campus"
                className="h-[300px] w-full rounded-[1.5rem] object-cover sm:h-[390px]"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <div className="rounded-2xl bg-[#f7f2e8] p-4">
                  <p className="text-sm font-semibold text-[#1F4788]">For students</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Find a space that suits your studies, budget and lifestyle.
                  </p>
                </div>
                <div className="rounded-2xl bg-[#1F4788] p-4 text-white">
                  <p className="text-sm font-semibold">For providers</p>
                  <p className="mt-1 text-sm leading-6 text-white/85">
                    Share your property with students looking for accommodation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C2410C]">
              Why Garikai Realty
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight text-[#1F4788] sm:text-4xl">
              Housing is personal. The search should be, too.
            </h2>
            <p className="mt-5 text-base leading-8 text-gray-600">
              A good accommodation decision is about more than four walls. It
              is about feeling comfortable, getting to campus, managing rent
              and knowing what to expect. We focus on the practical details
              while remembering the people behind every search and every
              property.
            </p>
            <div className="mt-7 overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
                alt="Bright, welcoming home interior"
                className="h-64 w-full object-cover sm:h-72"
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <motion.article
                key={benefit.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl border border-[#1F4788]/10 bg-[#f7f2e8]/70 p-6 sm:p-7"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1F4788] text-sm font-bold text-white">
                  {benefit.number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-[#1F4788]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {benefit.text}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 overflow-hidden rounded-[2rem] shadow-lg shadow-[#1F4788]/10 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="People working together and having a thoughtful conversation"
                className="h-[300px] w-full object-cover sm:h-[400px]"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C2410C]">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#1F4788] sm:text-4xl">
                A clearer path from searching to settling in.
              </h2>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7494c8]/20 font-bold text-[#1F4788]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-gray-600">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1F4788] text-white">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                Let’s take the next step
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
                Whether you’re finding a home or offering one, let’s make the
                process feel easier.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/85">
                Start a conversation, share what you need, and get clarity on
                the details that matter to you.
              </p>
            </div>
            <a
              href={process.env.JEFF_WA_NUMBER || "/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-[#1F4788] transition-colors hover:bg-[#f7f2e8]"
            >
              Talk to Garikai
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUsPage;
