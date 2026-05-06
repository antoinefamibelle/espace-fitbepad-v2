import type { Metadata } from 'next';
import { Poppins, Inter, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import queryClient from '@frontend/lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@frontend/components/ui/sonner';
import { headers } from 'next/headers';
import { Navbar } from '@frontend/components/layout/navbar';
import FooterWrapper from '@frontend/components/layout/footer-wrapper';
// import { Analytics } from '@vercel/analytics/next';
// import { SpeedInsights } from '@vercel/speed-insights/next';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

const noka = localFont({
  src: [
    {
      path: '../../../public/noka-font/NokaTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/noka-font/NokaTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/noka-font/NokaTrial-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/noka-font/NokaTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/noka-font/NokaTrial-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-noka',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="fr" suppressHydrationWarning>
        <head>
            {/* <script
              dangerouslySetInnerHTML={{
                __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="${process.env.CRISP_WEBSITE_ID}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
              }}
            /> */}
        </head>
        <body className={`${poppins.variable} ${inter.variable} ${noka.variable} ${montserrat.variable} font-montserrat`}>
          <ThemeProvider
            attribute="class"
            enableSystem={true}
            defaultTheme="light"
          >
            <Navbar />
            {children}
            <FooterWrapper />
            <Toaster richColors />
          </ThemeProvider>
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </body>
      </html>
    </QueryClientProvider>
  );
}
