import { config } from 'dotenv';

config();

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

let lastBetaTesters = 0;

if (!webhookUrl) 
  throw new Error('DISCORD_WEBHOOK_URL is not set');

async function sendUpdate() {
  const response = await fetch('https://api.retool.com/v1/workflows/629ac40b-46c2-4cb5-8d16-ee9d482781e0/startTrigger?workflowApiKey=retool_wk_ad878a1e91ad47c3bd1f754c426da0cf')
    .then(result => result.json());
  
  const { betaTesters } = response;

  await fetch(webhookUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [{
        title: betaTesters > lastBetaTesters ? 'New beta tester(s)!' : 'Current beta testers',
        description: (betaTesters > lastBetaTesters ? 
          `We have ${betaTesters - lastBetaTesters} new beta tester(s)! Now at ${betaTesters} on the [Arc Browser](https://www.isarconwindowsyet.com/)!` : 
          `We currently have ${betaTesters} beta testers on the [Arc Browser](https://www.isarconwindowsyet.com/)!`),
        color: betaTesters > lastBetaTesters ? 0xaaffaa : 0x3139fb,
        timestamp: new Date().toISOString()
      }]
    })
  });

  lastBetaTesters = betaTesters;
}

async function main() {
  // Send an update immediately, then every minute
  await sendUpdate();
  setInterval(sendUpdate, 60_000);
}

main();
