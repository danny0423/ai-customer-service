// utils/embedding.js
import fetch from 'node-fetch';

import { API } from '../../aiTest';



export async function getEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002', // 這是 OpenAI 最常用的 embedding 模型
    }),
  });

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('無法取得 embedding');
  }

  return data.data[0].embedding;
}
