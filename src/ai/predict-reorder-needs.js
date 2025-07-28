'use server';

/**
 * @fileOverview AI-powered predictive ordering flow.
 *
 * - predictReorderNeeds - Predicts reorder needs based on historical data, booking patterns, and external factors.
 * - PredictReorderNeedsInput - The input type for the predictReorderNeeds function.
 * - PredictReorderNeedsOutput - The return type for the predictReorderNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictReorderNeedsInputSchema = z.object({
  pmsIntegrationData: z
    .string()
    .describe('Real-time occupancy rates, booking forecasts, guest demographics from PMS.'),
  historicalUsageData: z
    .string()
    .describe('Item replacement cycles, seasonal consumption patterns, wear rates.'),
  externalData: z
    .string()
    .describe('Weather patterns, local events, tourism seasons, economic indicators.'),
  propertySpecificVariables: z
    .string()
    .describe('Property age, guest type (business vs leisure), star rating, location.'),
});
export type PredictReorderNeedsInput = z.infer<typeof PredictReorderNeedsInputSchema>;

const PredictReorderNeedsOutputSchema = z.object({
  reorderPredictions: z
    .string()
    .describe('Predictions for reorder needs, including item, quantity, and timing.'),
  smartAlerts: z.string().describe('Smart alerts based on predictions.'),
  optimalOrderingTiming: z
    .string()
    .describe('Suggested optimal ordering timing for capturing bulk discounts.'),
  maintenancePredictions: z
    .string()
    .describe('Forecasts for when items will need replacement.'),
});
export type PredictReorderNeedsOutput = z.infer<typeof PredictReorderNeedsOutputSchema>;

export async function predictReorderNeeds(input: PredictReorderNeedsInput): Promise<PredictReorderNeedsOutput> {
  return predictReorderNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictReorderNeedsPrompt',
  input: {schema: PredictReorderNeedsInputSchema},
  output: {schema: PredictReorderNeedsOutputSchema},
  prompt: `You are an AI assistant designed to predict procurement needs for the hospitality industry.

  Analyze the following data to predict reorder needs, suggest smart alerts, and provide optimal ordering timing.

  PMS Integration Data: {{{pmsIntegrationData}}}
  Historical Usage Data: {{{historicalUsageData}}}
  External Data: {{{externalData}}}
  Property-Specific Variables: {{{propertySpecificVariables}}}

  Provide your predictions in a structured format, including:
  - reorderPredictions: Predictions for reorder needs, including item, quantity, and timing.
  - smartAlerts: Smart alerts based on predictions. Example: "Based on your December bookings, you'll need 40% more towels by November 15th"
  - optimalOrderingTiming: Suggested optimal ordering timing for capturing bulk discounts.
  - maintenancePredictions: Forecasts for when items will need replacement based on usage patterns.
  `, // Added closing backtick
});

const predictReorderNeedsFlow = ai.defineFlow(
  {
    name: 'predictReorderNeedsFlow',
    inputSchema: PredictReorderNeedsInputSchema,
    outputSchema: PredictReorderNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
