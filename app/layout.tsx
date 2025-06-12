import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import {
  Inter,
  Roboto,
  Open_Sans,
  Poppins,
  Montserrat,
  Playfair_Display,
  Source_Code_Pro,
  Nunito,
  Lato,
  Raleway,
} from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" })
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })
const poppins = Poppins({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const sourceCode = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code" })
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-lato" })
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" })

export const metadata = {
  title: "Social Media Post Generator",
  description: "Generate custom social media post images with your text and profile",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`
      ${inter.variable} 
      ${roboto.variable} 
      ${openSans.variable} 
      ${poppins.variable} 
      ${montserrat.variable} 
      ${playfair.variable} 
      ${sourceCode.variable} 
      ${nunito.variable} 
      ${lato.variable} 
      ${raleway.variable}
    `}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
