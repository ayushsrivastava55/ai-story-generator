const OpenAI = require('openai');

const generateStory = async (req, res) => {
    try {
        const { characters, setting, theme, ageGroup } = req.body;
        
        // Initialize OpenAI
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Format character introductions
        const mainCharacter = characters[0];
        const supportingCharacters = characters.slice(1).join(' and ');

        // Determine age-appropriate complexity
        let complexity = '';
        if (ageGroup.includes('3-5')) {
            complexity = 'Use very simple words, short sentences, and repetitive patterns suitable for preschoolers.';
        } else if (ageGroup.includes('6-8')) {
            complexity = 'Use simple language with some descriptive words and shorter paragraphs suitable for early readers.';
        } else {
            complexity = 'Use engaging vocabulary and descriptive language suitable for confident readers, but keep it appropriate for children.';
        }

        // Create a detailed prompt for GPT
        const prompt = `You are a professional children's story writer. Write an original, engaging children's story with these requirements:

STORY ELEMENTS:
- Main Character: ${mainCharacter}
${supportingCharacters ? `- Supporting Characters: ${supportingCharacters}` : ''}
- Setting: ${setting}
- Theme/Lesson: ${theme}
- Target Age: ${ageGroup} years old

WRITING STYLE:
- ${complexity}
- Use colorful and imaginative descriptions
- Include natural-sounding dialogue
- Create emotional connections with characters
- Maintain a positive and uplifting tone

STORY STRUCTURE:
1. Start with "Once upon a time"
2. Introduce the characters and setting vividly
3. Present a clear problem or challenge related to ${theme}
4. Show character growth and development
5. Include a satisfying resolution
6. End with a clear moral lesson about ${theme}
7. Conclude with "The End"

IMPORTANT GUIDELINES:
- Keep the story length appropriate for ${ageGroup} year olds
- Ensure all content is child-friendly and positive
- Make the story engaging and interactive
- Include moments of gentle humor
- Create memorable and quotable lines
- Make the moral lesson clear but not preachy

Please generate a complete, coherent story that follows all these requirements.`;

        // Generate the story using GPT-3.5
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "You are a professional children's story writer who creates engaging, age-appropriate stories with clear moral lessons."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0.3
        });

        let story = completion.choices[0].message.content;

        // Ensure proper story formatting
        if (!story.toLowerCase().startsWith('once upon a time')) {
            story = 'Once upon a time, ' + story;
        }

        // Format paragraphs and ensure proper ending
        story = story
            .split('\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .join('\n\n');

        if (!story.toLowerCase().includes('the end')) {
            story += '\n\nThe End';
        }

        // Send the response
        res.status(200).json({
            success: true,
            story,
            metadata: {
                mainCharacter,
                setting,
                theme,
                ageGroup,
                supportingCharacters: characters.slice(1)
            }
        });

    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate story',
            message: error.message
        });
    }
};

module.exports = {
    generateStory
};
