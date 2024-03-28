import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider'
import { QueryProvider } from '@/components/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'Team Chat App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <body className={font.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SocketProvider >
              <ModalProvider />
                <QueryProvider>
                    {children}
                </QueryProvider>
            </SocketProvider >
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
