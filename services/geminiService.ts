
import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const restoreImage = async (imageFile: File, userPrompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(imageFile);
  const mimeType = imageFile.type;

  if (!mimeType.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  const basePrompt = `You are an expert AI photo restoration artist. 
  Restore this old, faded, or black-and-white photo. 
  Enhance details, remove noise, scratches, and artifacts. 
  Apply natural, vibrant, and historically accurate colors. 
  Upscale the image to high resolution, making it sharp and clear. 
  The final output should be a photographically realistic image.
  `;
  
  const finalPrompt = userPrompt ? `${basePrompt}\nUser instructions: "${userPrompt}"` : basePrompt;
  
  const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    }
    
    throw new Error("Could not restore image. The AI model did not return an image.");
};
