const axios = require('axios');

// You should store your Gemini API key in an environment variable (e.g., .env file)
const GEMINI_API_KEY = 'AIzaSyDfhnXr3Z5DfCEpJkrhHGkNz_j0Z3usp1o';  // Replace with your Gemini API key

// Your Gemini API key (make sure to store this securely in .env file)

// Function to generate content using Gemini
const generateContent = async (prompt) => {
  try {
    // Endpoint for Gemini content generation
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY;

    const response = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: prompt,   // The text prompt for content generation
            }
          ]
        }
      ]
    });


    
    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.log('Error generating content with Gemini API:', error);
    throw new Error('Error generating content');
  }
};

module.exports = { generateContent };
