import { db } from "../utils/config";

export const SoftDeleteQuiz = async (quiz) => {
  console.log("🚀 ~ SoftDeleteQuiz ~ quiz:", quiz.id);
  try {
    await db.collection("quizzes").doc(quiz.id).update({
      isDeleted: true,
    });
  } catch (error) {
    console.log("🚀 ~ SoftDeleteQuiz ~ error:", error);
    return true;
  }
};
