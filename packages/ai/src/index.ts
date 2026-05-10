import OpenAI from 'openai';

export const getOpenRouterClient = (apiKey: string) => {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://github.com/flowpatch/flowpatch',
      'X-Title': 'flowPatch AI Engine',
    },
  });
};

export const MODELS = {
  REASONING: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
  EMBEDDING: 'nvidia/llama-nemotron-embed-vl-1b-v2:free',
  LLAMA_FREE: 'meta-llama/llama-3.1-8b-instruct:free',
  GEMINI_FREE: 'google/gemini-2.0-flash-exp:free',
};

export async function chat(client: OpenAI, messages: any[], model: string = MODELS.REASONING, json: boolean = false) {
  try {
    const response = await client.chat.completions.create({
      model: model,
      messages: messages,
      response_format: json ? { type: 'json_object' } : undefined,
    });
    
    if (!response.choices || response.choices.length === 0) {
      console.error('OpenRouter returned an empty response choices array.');
      return null;
    }

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error(`OpenRouter Chat Error (${model}):`, error.message);
    if (error.status === 404) {
      console.error('Model not found. Please check the model name.');
    }
    return null;
  }
}

export async function embed(client: OpenAI, input: string | string[], model: string = MODELS.EMBEDDING) {
  try {
    const response = await client.embeddings.create({
      model: model,
      input: input,
    });
    return response.data;
  } catch (error: any) {
    console.error(`OpenRouter Embedding Error (${model}):`, error.message);
    return null;
  }
}
