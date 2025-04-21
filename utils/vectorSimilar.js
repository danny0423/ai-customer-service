

const api_key = import.meta.env.VITE_OPENAI_API_KEY


// ✅ 2. 假設我們資料庫裡 FAQ 是這樣（已經有 embedding 向量）
const faqs = {};
const res = await fetch('http://localhost:3000/faq');
const data = await res.json();
data.forEach(element => {
  faqs[element.question] = element
});



console.log('faqs =', faqs);

const embeddedFAQs = await Promise.all(
  Object.keys(faqs).map(async (q) => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: q,
        model: 'text-embedding-ada-002',
      }),
    });
    const data = await response.json();
    return {
      question: q,
      answer: faqs[q].answer,
      embedding: data.data[0].embedding, // 不用 slice
    };
  }),
);

// ✅ 3. 計算餘弦相似度
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;

  return dot / (magA * magB);
}

// ✅ 4. 拿文字去 OpenAI 要求 embedding 向量
async function getEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-ada-002',
    }),
  });

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('無法取得 embedding');
  }

  return data.data[0].embedding; // 假裝只取前5維，跟假資料對齊
}

// ✅ 5. 主流程：語意比對找最相近 FAQ
async function findBestMatch(userInput, faqList) {
  const inputVector = await getEmbedding(userInput);

  const scores = faqList.map((faq) => {
    const score = cosineSimilarity(inputVector, faq.embedding);
    return { faq, score };
  });

  scores.sort((a, b) => b.score - a.score);

  const best = scores[0];

  return best.score > 0.9
    ? best.faq.answer
    : false;
}

// ✅ 6. 模擬一次查詢
export default async function vectorSimilar(inputValue) {
  const result = await findBestMatch(inputValue, embeddedFAQs);
  return result;
}
