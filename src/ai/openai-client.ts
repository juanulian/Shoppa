import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ResponsesAPIInput {
  model: string;
  input: string | Array<{role: string; content: string}>;
  reasoning?: {
    effort?: 'minimal' | 'low' | 'medium' | 'high';
  };
  text?: {
    verbosity?: 'low' | 'medium' | 'high';
  };
  tools?: any[];
  response_format?: {
    type: 'json_schema';
    json_schema: {
      name: string;
      schema: any;
      strict?: boolean;
    };
  };
}

export async function callResponsesAPI(params: ResponsesAPIInput) {
  const response = await openai.chat.completions.create({
    model: params.model,
    messages: typeof params.input === 'string'
      ? [{ role: 'user', content: params.input }]
      : params.input as any,
    ...(params.response_format && { response_format: params.response_format }),
    ...(params.tools && { tools: params.tools }),
  });

  return response.choices[0].message;
}
