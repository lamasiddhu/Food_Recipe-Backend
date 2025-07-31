const { generateContent } = require('../services/geminiService');



const getGeneratedContent = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === '') {
    return res.status(400).json({ message: 'Please provide a valid prompt.' });
  }

  try {
    const content = await generateContent(prompt);

    if (!content) {
      return res.status(404).json({ message: 'No content generated.' });
    }

    res.status(200).json({
      message: 'Content generated successfully!',
      generatedContent: content, // Adjust based on Gemini's response format
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating content, please try again later.' });
  }
};

module.exports = { getGeneratedContent };


module.exports = { getGeneratedContent };
