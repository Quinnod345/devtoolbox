import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevToolbox — Free Developer Utilities",
  description: "Free online developer tools: JSON formatter, Base64 encoder, JWT decoder, regex tester, hash generator, and more. Fast, private, no signup required.",
  keywords: "developer tools, json formatter, base64 encoder, jwt decoder, regex tester, hash generator, online tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e0e0e0; }
          a { color: #60a5fa; text-decoration: none; }
          a:hover { text-decoration: underline; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
