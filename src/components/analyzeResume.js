import axios from 'axios';

// Function to analyze the resume text using GPT API
const analyzeResume = async (resumeText, jobDescription) => {
  try {
    // Send text and job description to GPT API for analysis
    const gptResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional resume analyzer. Compare resumes against job descriptions and provide a relevance score from 0-100 along with feedback on areas for improvement."
          },
          {
            role: "user",
            content: `Analyze this resume:\n\n${resumeText}\n\nBased on the following job description:\n\n${jobDescription}`
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract feedback and relevance score from GPT response
    const gptAnalysis = gptResponse.data.choices[0].message.content;

    // Parse score from GPT's response (expecting a structured output)
    const scoreMatch = gptAnalysis.match(/Relevance Score: (\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50; // Default to 50 if no score is found

    // Return score and feedback
    return { score, feedback: gptAnalysis };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw new Error('Failed to analyze resume');
  }
};

export default analyzeResume;
