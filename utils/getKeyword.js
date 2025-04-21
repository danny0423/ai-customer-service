
export  default async function findKeyword(userInput) {
  const res = await fetch('http://localhost:3000/faq');
  const data = await res.json();
  const keywordList = []
  const input = userInput.toLowerCase();
  
  for (const faq of data) {
    console.log('faq =', faq);

    //['電話', '客服', '聯絡', '聯繫']
    const match = faq.keywords.find((kw) => {
      console.log('input =', input);
      console.log('kw =', kw);
      return input.includes(kw)
    });
    if (match) {
      keywordList.push(faq.answer) ;  //目前是預設回覆訊息，未來應該改成詳細的info
    }
  }
  return keywordList
}






