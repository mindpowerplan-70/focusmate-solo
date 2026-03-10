// api/breakdown.js
// This is a Vercel serverless function — it runs on the server,
// not in the browser, so your API key stays safe.
// It receives a task from the dashboard, sends it to Claude,
// and returns 8 ADHD-friendly steps.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { task } = req.body;

  // Make sure a task was actually sent
  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "No task provided" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are an ADHD coach helping a freelancer break down a scary task into manageable steps.

The freelancer's task is: "${task}"

Break this down into exactly 8 steps. Each step must:
- Start with a verb (Open, Write, Copy, Click, etc.)
- Take no more than 15 minutes
- Be so specific and small that starting feels effortless
- The first step must be the absolute easiest possible action

Return ONLY a JSON array of 8 strings, nothing else. No preamble, no explanation.
Example format: ["Step 1 here", "Step 2 here", "Step 3 here"]`,
          },
        ],
      }),
    });

    const data = await response.json();

    // Extract the text content from Claude's response
    const content = data.content[0].text;

    // Parse the JSON array of steps
    const steps = JSON.parse(content);

    return res.status(200).json({ steps });
  } catch (error) {
    console.error("Claude API error:", error);
    return res.status(500).json({ error: "Failed to break down task" });
  }
}
