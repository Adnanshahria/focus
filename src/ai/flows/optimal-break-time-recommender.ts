'use server';
/**
 * @fileOverview Recommends an optimal break duration based on focus history and user activity.
 *
 * - getOptimalBreakTime - A function that recommends an optimal break duration.
 * - OptimalBreakTimeInput - The input type for the getOptimalBreakTime function.
 * - OptimalBreakTimeOutput - The return type for the getOptimalBreakTime function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OptimalBreakTimeInputSchema = z.object({
  focusHistory: z
    .string()
    .describe(
      'A summary of the user\'s focus history, including session durations and types.'
    ),
  currentActivity: z
    .string()
    .describe(
      'A description of the user\'s current activity, such as the task they are working on and their current energy level.'
    ),
});
export type OptimalBreakTimeInput = z.infer<typeof OptimalBreakTimeInputSchema>;

const OptimalBreakTimeOutputSchema = z.object({
  recommendedBreakDuration: z
    .number()
    .describe(
      'The recommended break duration in minutes, based on the user\'s focus history and current activity.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the recommended break duration, explaining how the focus history and current activity were taken into account.'
    ),
});
export type OptimalBreakTimeOutput = z.infer<typeof OptimalBreakTimeOutputSchema>;

export async function getOptimalBreakTime(
  input: OptimalBreakTimeInput
): Promise<OptimalBreakTimeOutput> {
  return optimalBreakTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimalBreakTimePrompt',
  input: { schema: OptimalBreakTimeInputSchema },
  output: { schema: OptimalBreakTimeOutputSchema },
  prompt: `You are an AI assistant that recommends optimal break durations for users based on their focus history and current activity.

  Analyze the following information to determine the best break duration:

  Focus History: {{{focusHistory}}}
  Current Activity: {{{currentActivity}}}

  Consider factors such as the length of recent focus sessions, the type of tasks the user has been working on, and their current energy level.

  Provide a recommended break duration in minutes and explain your reasoning.

  Format your output as a JSON object with the following keys:
  - recommendedBreakDuration (number): The recommended break duration in minutes.
  - reasoning (string): The reasoning behind the recommendation.
  `,
});

const optimalBreakTimeFlow = ai.defineFlow(
  {
    name: 'optimalBreakTimeFlow',
    inputSchema: OptimalBreakTimeInputSchema,
    outputSchema: OptimalBreakTimeOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      if (!output) {
        throw new Error("AI failed to generate a recommendation.");
      }
      return output;
    } catch (error) {
      console.error("Error in optimalBreakTimeFlow:", error);
      throw new Error("Failed to generate break recommendation. Please try again.");
    }
  }
);
