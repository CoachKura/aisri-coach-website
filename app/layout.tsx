import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AISRI Coach - AI-Powered Performance Coaching',
  description: 'Train smarter. Run injury-free. Real-time AISRI scoring, biomechanics analysis, and adaptive training.',
  keywords: ['running', 'training', 'coaching', 'biomechanics', 'injury prevention', 'performance'],
  authors: [{ name: 'AISRI Coach' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aisricoach.com',
    title: 'AISRI Coach - AI-Powered Performance Coaching',
    description: 'Train smarter. Run injury-free.',
    images: [{ url: 'https://aisricoach.com/og-image.jpg' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-gray-100">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
