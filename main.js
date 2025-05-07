const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// GPT에게 요리 레시피 프롬프트로 전달
async function fetchGPTResponse(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "user", "content": prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error(`응답 오류: ${response.status}`);

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (err) {
    console.error("API 요청 실패:", err);
    return "죄송합니다. 레시피를 불러오는 데 실패했습니다.";
  }
}

// 메시지 전송 동작 함수
async function handleSend() {
  const ingredients = userInput.value.trim();
  if (!ingredients) return;

  // 사용자 입력 출력
  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${ingredients}</div>`;
  userInput.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  // GPT에게 보낼 프롬프트 구성
  const prompt = `다음 재료를 활용한 간단한 한식 요리 레시피를 하나 추천해줘. 
레시피 이름과 필요한 재료, 간단한 조리법을 포함해줘.
재료: ${ingredients}`;

  const reply = await fetchGPTResponse(prompt);

  // GPT 응답 출력
  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${reply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 버튼 클릭 시 전송
sendBtn.addEventListener('click', handleSend);

// 엔터 키로도 전송 가능하게
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSend();
  }
});
