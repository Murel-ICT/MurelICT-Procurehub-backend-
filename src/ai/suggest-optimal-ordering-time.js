'use server';

/**
 * @fileOverview An AI agent that suggests the optimal ordering timing to capture bulk discounts.
 *
 * - suggestOptimalOrderingTime - A function that suggests the optimal ordering time for a given item.
 * - SuggestOptimalOrderingTimeInput - The input type for the suggestOptimalOrderingTime function.
 * - SuggestOptimalOrderingTimeOutput - The return type for the suggestOptimalOrderingTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalOrderingTimeInputSchema = z.object({
  itemName: z.string().describe('The name of the item to order.'),
  quantity: z.number().describe('The quantity of the item to order.'),
  historicalUsageData: z.string().describe('Historical usage data for the item.'),
  seasonalConsumptionPatterns: z.string().describe('Seasonal consumption patterns for the item.'),
  bulkDiscountDetails: z.string().describe('Details about available bulk discounts.'),
});
export type SuggestOptimalOrderingTimeInput = z.infer<typeof SuggestOptimalOrderingTimeInputSchema>;

const SuggestOptimalOrderingTimeOutputSchema = z.object({
  optimalOrderingTime: z.string().describe('The suggested optimal ordering time to capture bulk discounts.'),
  reasoning: z.string().describe('The reasoning behind the suggested ordering time.'),
});
export type SuggestOptimalOrderingTimeOutput = z.infer<typeof SuggestOptimalOrderingTimeOutputSchema>;

export async function suggestOptimalOrderingTime(input: SuggestOptimalOrderingTimeInput): Promise<SuggestOptimalOrderingTimeOutput> {
  return suggestOptimalOrderingTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalOrderingTimePrompt',
  input: {schema: SuggestOptimalOrderingTimeInputSchema},
  output: {schema: SuggestOptimalOrderingTimeOutputSchema},
  prompt: `You are an AI assistant helping procurement managers to optimize their ordering timing.

You will analyze the provided information and suggest the optimal ordering time to capture bulk discounts.
Consider historical usage data, seasonal consumption patterns, and available bulk discount details.

Item Name: {{{itemName}}}
Quantity: {{{quantity}}}
Historical Usage Data: {{{historicalUsageData}}}
Seasonal Consumption Patterns: {{{seasonalConsumptionPatterns}}}
Bulk Discount Details: {{{bulkDiscountDetails}}}

Based on this information, when should the procurement manager order the item to get the best deal?
Explain your reasoning.

Optimal Ordering Time: 
Reasoning: `,
});

const suggestOptimalOrderingTimeFlow = ai.defineFlow(
  {
    name: 'suggestOptimalOrderingTimeFlow',
    inputSchema: SuggestOptimalOrderingTimeInputSchema,
    outputSchema: SuggestOptimalOrderingTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
