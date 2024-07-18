import React, { useState, useEffect } from "react";
import { db } from "../utils/config";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const quizRef = db.collection("quizzes").where("isDeleted", "==", false);
  const [user, setUser] = useState({
    name: "testName",
    code: "testCode",
    isLogin: false,
  });

  const [quizzes, setQuizzes] = useState(null);

  const logout = () => {
    setUser({
      name: "testName",
      code: "testCode",
      isLogin: false,
    });
  };

  useEffect(() => {
    if (user?.isLogin) {
      const subscriber = quizRef.onSnapshot((documentSnapshot) => {
        const quizData = documentSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log("🚀 ~ subscriber ~ quizData:", quizData);

        setQuizzes(quizData);
      });

      // Stop listening for updates when no longer required
      return () => subscriber();
    }
  }, [user?.isLogin]);

  return (
    <AppContext.Provider value={{ user, setUser, quizzes, setQuizzes, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};

export default AppContext;
