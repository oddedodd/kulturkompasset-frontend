// src/lib/sanity.client.ts
import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.SANITY_API_VERSION || '2025-08-31',
  // Bruk CDN når vi ikke har token (public dataset). Ved token: slå av CDN for ferske/autoriserte treff.
  useCdn: !process.env.SANITY_API_READ_TOKEN,
  token: process.env.SANITY_API_READ_TOKEN, // ikke satt for public dataset
  perspective: 'published', // hent kun publiserte dokumenter
});