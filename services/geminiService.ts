
import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateStyledImage = async (imageFile: File, prompt: string): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  try {
    const base64Image = await fileToBase64(imageFile);

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: imageFile.type,
            },
          },
          {
            text: `Given the person in this image, redraw them wearing the following outfit: ${prompt}. Do not change the person's pose or the background.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData?.data) {
      return firstPart.inlineData.data;
    } else {
      throw new Error("The API did not return an image. Please try a different prompt.");
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate image. The model may have refused the request due to safety policies or an invalid prompt. Please try again.');
  }
};
