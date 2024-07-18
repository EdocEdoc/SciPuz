import { db } from "../utils/config";

export const getCodes = async (accessCode) => {
  if (!accessCode) {
    return null;
  }

  try {
    const codes = await db
      .collection("codes")
      .where("code", "==", accessCode)
      .where("availableUsage", ">", 0)
      .limit(1)
      .get();

    const codeData = codes.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    return codeData;
  } catch (error) {
    console.log("🚀 ~ getCodes ~ error:", error);
    return null;
  }
};

export const useCode = async (accessCode) => {
  try {
    const codeData = await getCodes(accessCode);
    if (Array.isArray(codeData) && codeData.length > 0) {
      const codeInfo = codeData[0];
      await db
        .collection("codes")
        .doc(codeInfo.id)
        .update({
          availableUsage: codeInfo.availableUsage - 1,
        });

      return { ...codeInfo, availableUsage: codeInfo.availableUsage - 1 };
    } else {
      console.log("🚀 ~ useCode ~ NO codeInfo");
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ useCode ~ error:", error);
    return null;
  }
};

export const logUsedCode = async (name, accessCode) => {
  if (name == "" || !name || !accessCode) {
    return null;
  }
  try {
    const codeData = await useCode(accessCode);
    if (codeData) {
      const datatoCreate = {
        name: name,
        timestamp: new Date(),
        code: codeData.code,
        type: codeData.type,
      };
      // add collection to a doc
      const newLogData = await db
        .collection("codes")
        .doc(codeData.id)
        .collection("logs")
        .add(datatoCreate);

      const logInfoID = newLogData?.id;
      const userData = { ...datatoCreate, id: logInfoID };
      console.log("🚀 ~ logUsedCode ~ userData:", userData);
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ logUsedCode ~ error:", error);
    return null;
  }
};
