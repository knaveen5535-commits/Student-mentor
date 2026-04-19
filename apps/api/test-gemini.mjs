import { generateChatCompletion } from './src/services/ai.service.js';

async function test() {
  try {
    const res = await generateChatCompletion({
      messages: [{ role: 'user', content: 'Say hello' }]
    });
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error(err);
  }
}
test();
