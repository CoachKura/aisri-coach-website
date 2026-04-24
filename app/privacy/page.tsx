"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Introduction",
    content:
      "AISRI Coach is an AI-powered running coach system. This Privacy Policy explains what data we collect, why we collect it, how it is protected, and your rights as an athlete. We are committed to full transparency — especially regarding data collected from wearable devices.",
  },
  {
    title: "2. Data We Collect",
    content: null,
    bullets: [
      "Account data: name, email address, password (hashed)",
      "Athlete profile: age, weight, height, sport, training level",
      "Daily readiness inputs: sleep hours, fatigue level, mood, muscle soreness",
      "Heart rate data: resting HR, average HR, max HR from workouts",
      "Running metrics from Garmin devices: cadence, stride length, ground contact time, vertical oscillation, pace, distance, elevation",
      "Training load and workout history",
      "HRV (Heart Rate Variability) when available from connected devices",
    ],
  },
  {
    title: "3. Why We Collect This Data",
    content: null,
    bullets: [
      "To calculate your AISRI readiness score and coaching recommendations",
      "To generate personalised 7-day training plans based on your physiology",
      "To detect overtraining, fatigue patterns, and injury risk",
      "To adapt future workouts based on your actual performance and recovery",
      "To provide real-time feedback during workouts via connected Garmin devices",
    ],
  },
  {
    title: "4. Garmin Data Integration",
    content:
      "AISRI Coach integrates with Garmin Connect via the official Garmin Health API (OAuth 2.0). When you connect your Garmin account, we access activity data including heart rate, cadence, pace, distance, and training metrics. This data is used solely to power your coaching experience. We request only the minimum permissions required. You can disconnect your Garmin account at any time from your profile settings.",
  },
  {
    title: "5. We Do NOT Sell Your Data",
    content:
      "We do not sell, rent, trade, or share your personal data or health metrics with any third party for commercial or advertising purposes. Your training data belongs to you. It is used exclusively to provide the AISRI coaching service.",
  },
  {
    title: "6. Data Storage & Security",
    content:
      "Your data is stored on secured servers with encrypted connections (HTTPS/TLS). Passwords are hashed using industry-standard algorithms and are never stored in plain text. Health and training data is stored in isolated, access-controlled databases. We retain your data for as long as your account is active or as required for service operation.",
  },
  {
    title: "7. Third-Party Services",
    content:
      "We integrate with Garmin Connect for wearable data. Their own Privacy Policy governs how Garmin handles your data on their platform. We do not integrate with advertising networks, data brokers, or analytics services that track you across the web.",
  },
  {
    title: "8. Your Rights",
    content: null,
    bullets: [
      "Access: Request a copy of all data we hold about you",
      "Correction: Update inaccurate data in your profile",
      "Deletion: Request full deletion of your account and all associated data",
      "Export: Export your training history in a portable format",
      "Disconnect: Revoke Garmin or any integration at any time",
    ],
  },
  {
    title: "9. Contact Us",
    content:
      "For any privacy questions, data requests, or to exercise your rights, contact us at privacy@aisricoach.com. We respond within 72 hours.",
  },
];

export default function Privacy() {
  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-gray-400">Last updated: April 2025</p>
          <p className="text-gray-400 mt-2 text-sm">
            Covers: AISRI Coach mobile app · Garmin wearable integration · Backend services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-6 border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-green-400 mb-3">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-gray-300 leading-relaxed">{section.content}</p>
              )}
              {section.bullets && (
                <ul className="space-y-2 mt-1">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-2 text-gray-300 text-sm">
                      <span className="text-green-400 mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}

          {/* No-sell highlight box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-xl p-6 border border-green-500/40 bg-green-500/5 text-center"
          >
            <p className="text-green-400 font-semibold text-lg">
              We do not sell your data. Ever.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Your health metrics are used only to coach you — nothing else.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
