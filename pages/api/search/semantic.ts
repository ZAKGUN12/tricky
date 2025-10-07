import { NextApiRequest, NextApiResponse } from 'next';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, limit = 10 } = req.query;
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const results = await semanticSearch(q, parseInt(limit as string));
    res.status(200).json(results);
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

async function semanticSearch(query: string, limit: number) {
  // Get query embedding (mock - use OpenAI embeddings in production)
  const queryEmbedding = await getEmbedding(query);
  
  // Get all tricks (in production, use vector database like Pinecone)
  const command = new ScanCommand({
    TableName: 'TrickShare-Tricks',
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': 'approved' }
  });

  const result = await docClient.send(command);
  const tricks = result.Items || [];

  // Calculate similarity scores
  const scoredTricks = await Promise.all(
    tricks.map(async (trick) => {
      const trickText = `${trick.title} ${trick.description} ${trick.tags?.join(' ')}`;
      const trickEmbedding = await getEmbedding(trickText);
      const similarity = cosineSimilarity(queryEmbedding, trickEmbedding);
      
      return {
        ...trick,
        similarity
      };
    })
  );

  // Sort by similarity and return top results
  return scoredTricks
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

async function getEmbedding(text: string): Promise<number[]> {
  // Mock embedding - in production, use:
  // - OpenAI embeddings API
  // - Sentence transformers
  // - AWS Bedrock
  
  // Simple hash-based mock embedding
  const hash = simpleHash(text);
  return Array.from({ length: 384 }, (_, i) => 
    Math.sin(hash + i) * 0.5 + 0.5
  );
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
