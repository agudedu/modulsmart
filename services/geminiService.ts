import type { UserInput } from '../types.ts';

export const generateModule = async (userInput: UserInput): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInput),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `An error occurred: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text;

  } catch (error) {
    console.error("Error fetching from backend API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate module: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};
