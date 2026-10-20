import React from 'react';
import ThesisClient from './ThesisClient';

import { createPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return createPageMetadata("/thesis");
}

export default function ThesisPage() {
  return <ThesisClient />;
}