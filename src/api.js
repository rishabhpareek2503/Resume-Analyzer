import axios from 'axios';

// Load API key from the .env file
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; 

const analyzeResume = async (resumeText) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
  
    try {
      const response = await axios.post(
        API_URL,
        {
          model: 'gpt-4o-mini', // Adjust model name as per your access
          messages: [
            { role: 'user', content: `Analyze this resume:\n\n${resumeText}` }
          ],
          max_tokens: 300,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Extract retry-after time, fallback to 1 second if not provided
        const retryAfter = parseInt(error.response.headers['retry-after'], 10) || 1000;
        console.error(`Rate limit hit. Retrying in ${retryAfter} ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter)); // Wait for the specified time
        return analyzeResume(resumeText); // Retry request
      } else {
        console.error('API Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to analyze resume');
      }
    }
};

export default analyzeResume;
