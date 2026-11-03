'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DOMPurify from 'dompurify';

interface AboutInfo {
  html: string;
}

const PrivacyPage: React.FC = () => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        const response = await fetch('/controller/privacyController');
        if (response.ok) {
          const data = await response.json();
          setAboutInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch about information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutInfo();
  }, []);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-xl p-3 sm:p-6"
        >
          <div className="privacy-policy-content text-gray-700">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-5 bg-gray-200 rounded w-5/6"></div>
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    aboutInfo?.html || 'Terms & Privacy Policy not available now.'
                  ),
                }}
              />
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .privacy-policy-content {
          font-size: 0.0.95rem;
          line-height: 1.8;
          overflow-wrap: anywhere;
        }

        .privacy-policy-content p {
          margin-top: 0;
          margin-bottom: 1.15rem;
        }

        .privacy-policy-content h1,
        .privacy-policy-content h2,
        .privacy-policy-content h3,
        .privacy-policy-content h4 {
          color: #111827;
          font-weight: 700;
          line-height: 1.35;
          margin-top: 2rem;
          margin-bottom: 0.85rem;
        }

        .privacy-policy-content h1 { font-size: 1.8rem; }
        .privacy-policy-content h2 { font-size: 1.45rem; }
        .privacy-policy-content h3 { font-size: 1.2rem; }
        .privacy-policy-content h4 { font-size: 1.05rem; }

        .privacy-policy-content ul,
        .privacy-policy-content ol {
          margin: 0.75rem 0 1.5rem;
          padding-left: 1.75rem;
        }

        .privacy-policy-content ul { list-style-type: disc; }
        .privacy-policy-content ol { list-style-type: decimal; }

        .privacy-policy-content li {
          margin-bottom: 0.55rem;
          padding-left: 0.2rem;
        }

        .privacy-policy-content strong {
          color: #1f2937;
          font-weight: 600;
        }

        .privacy-policy-content a {
          color: #15803d;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .privacy-policy-content hr {
          border: 0;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }

        @media (max-width: 640px) {
          .privacy-policy-content {
            font-size: 0.95rem;
            line-height: 1.75;
          }

          .privacy-policy-content h1 { font-size: 1.55rem; }
          .privacy-policy-content h2 { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPage;