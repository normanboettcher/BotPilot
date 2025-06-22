import './style.css'
import type { BotResponse } from './types';

const questionInput = document.querySelector<HTMLInputElement>('#question')!;
const sendButton = document.querySelector<HTMLButtonElement>('#send')!;
const responseText = document.querySelector<HTMLParagraphElement>('#response')!;

sendButton.addEventListener('click', async () => {
  const question = questionInput.value.trim();
  if (!question) return;

  const res = await fetch(`http://localhost:8000/chat?q=${encodeURIComponent(question)}`);
  const json = await res.json()
  console.log('json', JSON.stringify(json))
  const data = json as BotResponse;

  responseText.innerText = data.response;
});
