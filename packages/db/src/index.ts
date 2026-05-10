import { PrismaClient } from '@prisma/client';
import { Pinecone } from '@pinecone-database/pinecone';

export const prisma = new PrismaClient();

export const getPineconeClient = (apiKey: string) => {
  return new Pinecone({
    apiKey: apiKey,
  });
};

export async function saveSnippetToPinecone(
  pc: Pinecone,
  indexName: string,
  snippet: { id: string; content: string; embedding: number[]; type: string; metadata: any }
) {
  const index = pc.index(indexName);
  await index.upsert([
    {
      id: snippet.id,
      values: snippet.embedding,
      metadata: {
        content: snippet.content,
        type: snippet.type,
        ...snippet.metadata,
      },
    },
  ]);
}
