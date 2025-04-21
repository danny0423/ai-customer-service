import  findKeyword from './getKeyword';
import vectorSimilar from './vectorSimilar';


const api_key = import.meta.env.VITE_OPENAI_API_KEY

export default async function getResult(userInput) {
  
  try {
    let response ;

    const getSimilarWord = await vectorSimilar(userInput);
    const getKeyword = await findKeyword(userInput);


    if (getKeyword.length !== 0) {
      console.log('getKeyword =', getKeyword);
      return getKeyword;
    } else if (getSimilarWord !== false) {
      console.log('getSimilarWord =', getSimilarWord);
      return getSimilarWord;
    }

    const promptMessages =
        [
          {
            role: 'system',
            content: `你是世界上最溫柔體貼的客服專員。根據以下內部知識和規定，回答客戶的問題。若無法回答，請委婉說明將轉接人工客服。
                    請一定要嚴格遵守規定:
                    1.取消訂單、退貨等等的方案皆由人工決定，請不要隨意的回答相關問題
                    2.客戶就是老大，請全程使用敬語
                    3.如果客戶詢問的是沒掌握到的關鍵字，請不要隨意回答，而是提供人工客服管道

                    內部知識：
                    1. 如何取消訂單：請到訂單頁點選取消按鈕。
                    2. 商品未收到怎麼辦：請確認配送狀態，若超過三天未更新請聯絡客服。
                    3. 退貨流程：請至「我的訂單」點選「申請退貨」。
                    4. 我們賣的牙膏價格為500美金`,
          },
          {
            role: 'user',
            content:  `${userInput}\n請注意！回答盡量不能超過 20 個中文字！`,
          },
        ]
        

    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages: promptMessages,
        max_tokens: 200,
      }),
    });

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const message = data.choices[0].message.content;

    return message;
  } catch (error) {
    console.error('錯誤：', error);
  }
}
