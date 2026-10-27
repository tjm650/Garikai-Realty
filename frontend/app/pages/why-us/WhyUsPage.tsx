"use client";

import React from "react";
import { motion } from "motion/react";

const benefits = [
  {
    number: "01",
    title: "A better start for students",
    text: "Finding a place to stay should be an easy chapter, not another source of stress. Explore accommodation options that fit your needs, budget and everyday routine.",
  },
  {
    number: "02",
    title: "More visibility for property providers",
    text: "Your property deserves to be seen by the people who need it. Garikai Realty helps providers present their accommodation clearly and connect with students actively looking for a place to rent.",
  },
  {
    number: "03",
    title: "Clear information. Better decisions.",
    text: "Understand the details that matter before taking the next step: rental price, room availability, location and amenities. Clear information helps students compare options and helps providers set expectations.",
  },
  {
    number: "04",
    title: "People & support",
    text: "Every search is personal. Whether you are moving for college or managing a property, we aim to make the process easier to understand, easier to navigate and easily accessible.",
  },
];

const steps = [
  {
    title: "Tell us what you need",
    text: "Students can share their preferred area, budget and accommodation needs. Providers can showcase their property and availability.",
  },
  {
    title: "Explore suitable options",
    text: "Compare the details that matter to you, ask questions and narrow your choices without losing sight of your priorities.",
  },
  {
    title: "Confirm & Book",
    text: "Browse through the details directly and confirm arrangements with the property provider before enquring for a booking.",
  },
];

const WhyUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-gray-800">
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 pt-12 sm:px-8 sm:pt-16 py-7 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:pt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
        
            <h1 className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-6">
              A place to live.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-md">
              Moving for college, looking for a room, or getting new tenants
              into your property is a small but important step. Garikai Realty brings students
              and property providers closer in a simpler way.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={process.env.JEFF_WA_NUMBER || "/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center border  hover:border-[#C2410C] border-gray-700 rounded-full px-6 py-3 font-normal text-gray-700 transition-colors duration-500 hover:bg-gray-700 hover:text-white"
              >
                Find accommodation
              </a>
              <a
                href={process.env.HELP_CENTER_WA_NUMBER || "/"}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-gray-700  hover:border-[#C2410C] px-6 py-3 font-normal text-gray-700 transition-colors duration-500 hover:bg-gray-700 hover:text-white"
              >
                I have a property
              </a>
            </div>
            
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
                src="https://images.pexels.com/photos/6140610/pexels-photo-6140610.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="University students sharing a positive moment on campus"
                className="h-[300px] w-full rounded-[1.5rem] object-cover sm:h-[200px]"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <div className="rounded-2xl bg-[#f7f2e8] p-4">
                  <p className="text-sm font-semibold text-gray-700">Students</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Find a space that suits your budget.
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-700 p-4 text-[#f7f2e8]">
                  <p className="text-sm  text-white font-semibold">Providers</p>
                  <p className="mt-1 text-sm leading-6 text-white/85">
                    Share your property with students looking for accommodation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-10">
          <div>
          
            <h2 className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-6">
              Housing is personal. The search should be, too.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-md">
              A good accommodation decision is about more than four walls. It
              is about feeling comfortable, getting to campus, managing rent
              and knowing what to expect. We cover the details that matter to students and property providers, so you can make a decision with confidence.
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
                className="rounded-3xl border border-[#C2410C]/20 bg-white/30 p-6 sm:p-7"
              >
                {/* <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold border-[#1F4788]/40 text-[#C2410C]">
                  {benefit.number}
                </span> */}
                <h3 className="mt-5 text-xl font-semibold text-gray-600">
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

      <section className="pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 overflow-hidden rounded-[2rem] shadow-lg shadow-[#1F4788]/10 lg:order-1">
              <img
                src="https://images.pexels.com/photos/5538604/pexels-photo-5538604.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="People working together and having a thoughtful conversation"
                className="h-[300px] w-full object-cover sm:h-[400px]"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
             
              <h2 className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-6">
                A clearer path from searching to settling in.
              </h2>
              <div className="mt-8 space-y-6">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center border border-[#1F4788]/40 justify-center rounded-full font-bold text-[#C2410C]">
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
        <div className="mx-auto max-w-7xl overflow-hidden">
          <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div>
              <p className="text-2xl max-w-[85%] md:text-2xl lg:text-5xl text-gray-700 font-semibol mb-3">
                Let’s take the next step
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
    </div>
  );
};

export default WhyUsPage;
