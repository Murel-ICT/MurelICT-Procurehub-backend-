import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-ordering-time.ts';
import '@/ai/flows/generate-procurement-kit-description.ts';
import '@/ai/flows/predict-reorder-needs.ts';