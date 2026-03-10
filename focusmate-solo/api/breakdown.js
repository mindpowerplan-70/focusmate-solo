export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { task } = req.body;

  if (!task || task.trim() === "") {
    return res.status(400).json({ error: "No task provided" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Log so we can see if the key is loading
  console.log("API Key exists:", !!apiKey);
  console.log("API Key prefix:", apiKey ? apiKey.substring(0, 10) : "MISSING");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `You are an ADHD coach. Break this task into exactly 8 small steps, each starting with a verb, each under 15 minutes. Return ONLY a JSON array of 8 strings. No other text.

Task: "${task}"

Example: ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6", "Step 7", "Step 8"]`,
          },
        ],
      }),
    });

    // Log the full response for debugging
    const data = await response.json();
    console.log("Claude response status:", response.status);
    console.log("Claude response:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(500).json({
        error: "Claude API failed",
        details: data,
      });
    }

    const content = data.content[0].text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const steps = JSON.parse(content);
    return res.status(200).json({ steps });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
