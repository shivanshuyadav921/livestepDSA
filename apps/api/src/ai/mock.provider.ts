import { Injectable } from '@nestjs/common';
import {
  AIProvider,
  CompletionParams,
  StreamChunk,
} from './ai-provider.interface';

@Injectable()
export class MockAIProvider implements AIProvider {
  async complete(params: CompletionParams): Promise<string> {
    const prompt = params.prompt.toLowerCase();

    if (prompt.includes('understand') || prompt.includes('restatement')) {
      return JSON.stringify({
        restatement:
          'Find two numbers in the array that add up to a target value and return their indices.',
        constraints: [
          'Each input has exactly one solution',
          'Cannot use the same element twice',
          'Return indices in any order',
        ],
        examples: [
          'nums = [2,7,11,15], target = 9 → indices [0,1] because 2+7=9',
          'nums = [3,2,4], target = 6 → indices [1,2] because 2+4=6',
        ],
        goal: 'Return the indices of the two numbers that sum to target.',
      });
    }

    if (prompt.includes('observations')) {
      return JSON.stringify({
        observations: [
          {
            text: 'We need a pair of values, not just one.',
            question: 'What information do you need to remember as you scan?',
          },
          {
            text: 'Indices matter, not just the values themselves.',
            question: 'Why might position be as important as value here?',
          },
          {
            text: 'Each number is used at most once.',
            question: 'What does that rule eliminate from your approach?',
          },
        ],
      });
    }

    if (prompt.includes('pattern')) {
      return JSON.stringify({
        pattern: 'Hash Map Lookup',
        category: 'HASH_MAP',
        reasoning:
          'We need fast checks for whether a complement value was seen before while scanning once.',
        signals: [
          'Need O(1) partner lookup',
          'Single pass desired',
          'Pairs / complements',
        ],
      });
    }

    if (prompt.includes('recipe')) {
      return JSON.stringify({
        pattern: 'Hash Map Lookup',
        ingredients: ['Hash Map', 'Single pass through array'],
        steps: [
          { order: 1, action: 'Start with an empty map to remember seen numbers.' },
          { order: 2, action: 'Visit each number from left to right.' },
          { order: 3, action: 'Calculate the partner needed to reach the target.' },
          { order: 4, action: 'Check whether that partner is already in the map.' },
          { order: 5, action: 'Return both indices when the partner is found.' },
          { order: 6, action: 'Otherwise store the current number and its index.' },
        ],
      });
    }

    if (prompt.includes('complexity')) {
      return JSON.stringify({
        timeQuestion:
          'How many times does each element get visited in your recipe?',
        spaceQuestion:
          'What extra storage grows as the input array grows?',
        guidingNotes: [
          'Count the main loop',
          'Count what you store in the map',
        ],
      });
    }

    if (prompt.includes('analyze this code') || prompt.includes('feedback')) {
      return JSON.stringify({
        correctness: { status: 'partial', issues: ['Review edge cases'] },
        edgeCases: ['Empty array', 'No valid pair'],
        complexity: {
          time: 'O(n)',
          space: 'O(n)',
          assessment: 'Matches the hash map recipe well',
        },
        patternChoice: {
          detected: 'Hash Map Lookup',
          fit: 'Strong alignment with the recipe',
        },
        alternatives: ['Sort + two pointers if values could be sorted'],
        coachingNotes: [
          'You followed the recipe structure well',
          'Double-check what happens when no pair exists',
        ],
        reflection: [
          'Complement lookup is the key mental move for pair problems',
        ],
      });
    }

    return JSON.stringify({ message: 'Keep going — what do you notice next?' });
  }

  async *stream(params: CompletionParams): AsyncGenerator<StreamChunk> {
    const full = await this.complete(params);
    const words = full.split(' ');

    for (const word of words) {
      yield { content: word + ' ', done: false };
      await new Promise((r) => setTimeout(r, 20));
    }

    yield { content: '', done: true };
  }
}
