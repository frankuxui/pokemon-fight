import type React from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import './app.css'

import AppThemeProvider from 'src/providers/theme-provider'
import QueryProvider from 'src/providers/query-provider'
import { getConfig } from 'src/config'
import { Toaster } from 'src/components/ui'
import Aside from 'src/components/aside'

export const links: Route.LinksFunction = () => [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com'
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  },
]

export function Layout ({ children }: { children: React.ReactNode }) {

  // Utilidad donde almaceno la configuración general del sitio
  const siteConfig = getConfig()

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': siteConfig.seo.title,
    'url': siteConfig.seo.siteUrl,
    'description': siteConfig.seo.description,
    'image': siteConfig.seo.openGraph.image,
    'author': {
      '@type': 'Person',
      'name': siteConfig.seo.author,
      'url': siteConfig.seo.creator
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/** SEO Meta Tags */}
        <meta name="keywords" content={siteConfig.seo.keywords.join(', ')} />
        <meta name="author" content={siteConfig.seo.author} />
        <meta name="application-name" content={siteConfig.seo.applicationName} />
        <meta name="theme-color" content={siteConfig.seo.colorTheme} />
        <meta name="robots" content={siteConfig.seo.robots} />

        {/** Canonical  */}
        <link rel="canonical" href={siteConfig.seo.siteUrl} />

        {/** Primary meta tags */}
        <meta name="description" content={siteConfig.seo.description} />

        {/** Og */}
        <meta property="og:logo" content={siteConfig.seo.logo}/>
        <meta property="og:locale" content="es_ES"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={siteConfig.seo.title} />
        <meta property="og:description" content={siteConfig.seo.description} />
        <meta property="og:site_name" content={siteConfig.seo.title} />
        <meta property="og:image" content={siteConfig.seo.openGraph.image} />
        <meta property="og:image:alt" content={siteConfig.seo.title} />
        <meta property="og:image:type" content="image/webp"/>
        <meta property="og:image:width" content="1200"/>
        <meta property="og:image:height" content="630"/>

        {/** Facebook Og */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={siteConfig.seo.siteUrl}/>

        {/** Twitter Card  */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteConfig.seo.creator} />
        <meta name="twitter:creator" content={siteConfig.seo.creator} />
        <meta property="twitter:domain" content={siteConfig.seo.domain} />
        <meta property="twitter:url" content={siteConfig.seo.siteUrl} />
        <meta property="twitter:title" content={siteConfig.seo.title} />
        <meta property="twitter:description" content={siteConfig.seo.description} />
        <meta property="twitter:image" content={siteConfig.seo.openGraph.image} />
        <meta property="twitter:image:alt" content={siteConfig.seo.title} />

        <link rel='icon' href='/favicon.ico' />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />

        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        <Meta />
        <Links />
      </head>
      <body>
        <AppThemeProvider>
          {children}
          <Toaster />
          <Aside />
        </AppThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App () {
  return (
    <QueryProvider>
      <Outlet />
    </QueryProvider>
  )
}

export function ErrorBoundary ({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
