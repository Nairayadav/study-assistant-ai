import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { openai } from "./client";
import { z } from "zod";
import { TGenerateQuiz } from "@/types/gpt";

export const GenerateQuizContent = async (content: string) => {
	try {
		const response_structure = z.object({
			questions: z.array(
				z.object({
					question: z.string(),
					options: z.object({
						A: z.string(),
						B: z.string(),
						C: z.string(),
						D: z.string(),
					}),
					correct_answer: z.enum(["A", "B", "C", "D"]),
				})
			),
		});
		const shortDescription = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content: `
						You are an examination question selector tasked with generating multiple-choice questions based on the topics and constraints provided by the user. Follow these instructions:

						Instructions:
						Total Number of Questions:

						Generate the exact number of questions specified by the user (total_questions). Ensure that all questions are relevant to the specified topics.

						Topics:

						The questions should be evenly or proportionally distributed across all the topics provided by the user. Each topic should have at least one question, if possible.

						Difficulty Level:

						Each question should match the difficulty level specified by the user:

						Easy: School-level questions (basic knowledge or straightforward concepts).

						Medium: College-level questions (requires some analysis or application of knowledge).

						Hard: Research-level questions (in-depth knowledge, advanced concepts, or complex problem-solving).

						Question Format:

						For each question, provide 4 answer choices (labeled A, B, C, D), ensuring that:

						Only one choice is correct.

						The remaining three choices are incorrect (but plausible).

						Shuffle the choices randomly, so the correct answer does not appear in the same position for every question.

						Uniqueness:

						Ensure that the questions are unique and non-repetitive.

						Question Relevance:

						Ensure that all questions are relevant to the provided topics and appropriate for the specified difficulty.

						Correct Answer:

						For each question, identify which option is the correct answer (A, B, C, or D).

						Formatting:

						For each question, store the following details in JSON format:

						question: The generated question.

						options: An array of the four generated answer choices.

						correct_answer: The correct answer (A, B, C, or D).

						Verification:

						Double-check that the number of questions generated matches the total_questions requested.

						Verify that the difficulty level of each question aligns with the user's request.

						Ensure that the answer choices are accurate and properly randomized.

						return response in json format
					`,
				},
				{ role: "user", content: content },
			],
			model: "google/gemini-2.5-flash",
			response_format: zodResponseFormat(response_structure, "response_structure"),
		});
		return JSON.parse(shortDescription.choices[0].message.content as string) || null;
	} catch (error) {
		throw new Error(`Error generating response: ${error}`);
		return;
	}
};
