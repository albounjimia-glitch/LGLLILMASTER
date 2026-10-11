"use client";

import Error from "next/error";
import { LanguageProvider } from "@/context/LanguageContext";

export default function GlobalError() {
  return (
    <LanguageProvider>
      <html>
        <body>
          <Error statusCode={undefined as any} />
        </body>
      </html>
    </LanguageProvider>
  );
}
