import { doc, getDoc } from 'firebase/firestore';
import { db, saveQuizAnswers } from '../data/firebase'; // Ensure saveQuizAnswers is exported from your firebase config

/**
 * Checks for guest quiz data in sessionStorage and saves it to a newly logged-in user's Firebase document.
 * @param userId The ID of the user who just logged in or registered.
 */
export const saveGuestDataToFirebase = async (userId: string) => {
  const guestDataString = sessionStorage.getItem('guestQuizResults');

  if (guestDataString) {
    try {
      const guestData = JSON.parse(guestDataString);
      const { answers, prakriti } = guestData;

      if (answers && prakriti) {
        // Check if the user already has a prakriti to avoid overwriting it
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists() && !userDoc.data().prakriti) {
          // Save the quiz answers and prakriti to the user's profile
          await saveQuizAnswers(userId, answers, prakriti);
          console.log("Guest quiz results successfully saved to user's account.");
        }
      }

      // Important: Clear the temporary data now that it's been handled
      sessionStorage.removeItem('guestQuizResults');

    } catch (error) {
      console.error("Error processing or saving guest quiz data:", error);
      sessionStorage.removeItem('guestQuizResults'); // Clear even if there's an error
    }
  }
};