import '@/app/globals.css';
import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import MotionCornerMenu from '@/components/portfolio/MotionCornerMenu';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Portfolio - Développeur Full Stack',
  description: 'Portfolio professionnel d\'un développeur Full Stack passionné',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        {children}
        <Toaster />
        <MotionCornerMenu />
      </body>
    </html>
  );
}