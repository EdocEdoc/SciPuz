import { Alert, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import useState from "react-usestateref";
import {
  Button,
  Caption,
  Headline,
  Paragraph,
  Subheading,
  TextInput,
} from "react-native-paper";
import Spacer from "../../components/Spacer";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import { db, storage } from "../../utils/config";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import Crossword from "../../components/Crossword";
import { useAppContext } from "../../contexts/AppContext";
import { set } from "firebase/database";

const AddQuiz = ({ navigation, route }) => {
  const quiz = route?.params?.quiz;
  const { user } = useAppContext();
  const [selectedType, setSelectedType] = useState("image_puzzle");
  const [selectedOrientation, setselectedOrientation] = useState("down");

  const [imagePuzzleQuestion, setImagePuzzleQuestion, imagePuzzleQuestionRef] =
    useState(null);
  const [imagePuzzleAnswer, setImagePuzzleAnswer, imagePuzzleAnswerRef] =
    useState(null);
  const [
    imagePuzzleQuestionList,
    setImagePuzzleQuestionList,
    imagePuzzleQuestionListRef,
  ] = useState([]);
  const [imagePuzzleHolder, setImagePuzzleHolder] = useState(null);

  const [
    crosswordQuestionList,
    setCrosswordQuestionList,
    crosswordQuestionListRef,
  ] = useState([]);
  const [crosswordQuestionContent, setCrosswordQuestionContent] =
    useState(null);

  const [featuredImagePath, setFeaturedImagePath, featuredImagePathRef] =
    useState(null);
  const [featuredImageUrl, setFeaturedImageUrl, featuredImageUrlRef] =
    useState(null);

  const [quizVideoPath, setQuizVideoPath, quizVideoPathRef] = useState(null);
  const [quizVideoUrl, setQuizVideoUrl, quizVideoUrlRef] = useState(null);
  const video = React.useRef(null);

  const [isUploading, setIsUploading, isUploadingRef] = useState(false);
  const [isLoading, setIsLoading, isLoadingRef] = useState(false);

  const [title, setTitle, titleRef] = useState();
  const [description, setDescription, descriptionRef] = useState();

  useEffect(() => {
    if (quiz) {
      if (quiz?.type == "image_puzzle") {
        setImagePuzzleQuestionList(quiz.quiz);
      }

      if (quiz?.type == "crossword_puzzle") {
        setCrosswordQuestionList(quiz.quiz);
      }

      setFeaturedImagePath(null);
      setQuizVideoPath(null);
      setFeaturedImageUrl(quiz?.featuredImage);
      setQuizVideoUrl(quiz?.quizVideo);
      setTitle(quiz?.title);
      setDescription(quiz?.description);
      setSelectedType(quiz?.type);
    }
  }, [quiz]);

  const pickImage = async (type) => {
    // No permissions request is necessary for launching the image library
    // const permissions = await ImagePicker.getMediaLibraryPermissionsAsync();
    // console.log("🚀 ~ pickImage ~ permissions:", permissions);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      if (type === "featured_image") {
        setFeaturedImagePath(result.assets[0].uri);
      }

      if (type === "image_puzzle_image") {
        setImagePuzzleHolder(result.assets[0].uri);
      }
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    //console.log(result);

    if (!result.canceled) {
      setQuizVideoPath(result.assets[0].uri);
    }
  };

  const uploadMedia = async (path) => {
    if (!path) return null;
    var returnUrl = null;

    try {
      const { uri } = await FileSystem.getInfoAsync(path);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = path.substring(path.lastIndexOf("/") + 1);
      const ref = storage.ref().child(filename);

      const uploadData = await ref.put(blob);

      const mediaUrl = await ref.getDownloadURL();

      //console.log("🚀 ~ uploadMedia ~ mediaUrl:", mediaUrl);

      returnUrl = mediaUrl;
    } catch (error) {
      console.log("🚀 ~ uploadMedia ~ error:", error);
      return null;
    }

    return returnUrl;
  };

  const onUploadMedias = async () => {
    setIsUploading(true);
    if (featuredImagePath && !featuredImageUrlRef.current) {
      const rUrl3 = await uploadMedia(featuredImagePath);
      if (rUrl3) {
        setFeaturedImageUrl(rUrl3);
        Alert.alert("Upload Notice", "Feature Image Upload Success");
      } else {
        setFeaturedImageUrl(null);
      }
    }
    if (quizVideoPath && !quizVideoUrlRef.current) {
      const rUrl4 = await uploadMedia(quizVideoPath);
      if (rUrl4) {
        setQuizVideoUrl(rUrl4);
        Alert.alert("Upload Notice", "Quiz Video Upload Success");
      } else {
        setQuizVideoUrl(null);
      }
    }
    if (imagePuzzleQuestionList.length > 0) {
      var theList = [...imagePuzzleQuestionList];
      for (let i = 0; i < theList.length; i++) {
        if (
          !theList[i].imageUrl.includes(
            "https://firebasestorage.googleapis.com"
          )
        ) {
          const rUrl5 = await uploadMedia(theList[i].imageUrl);
          if (rUrl5) {
            theList[i].imageUrl = rUrl5;
          }
        }
      }
      Alert.alert("Upload Notice", "Puzzle images Upload Success");
    }
    setIsUploading(false);
  };

  const createQuiz = async () => {
    let contentData = [];
    const iUrl = featuredImageUrlRef.current || quiz?.featuredImage;
    const vUrl = quizVideoUrlRef.current || quiz?.quizVideo;

    if (selectedType == "image_puzzle") {
      contentData = imagePuzzleQuestionList.map((item, index) => {
        return { ...item, position: index + 1 };
      });
    }

    if (selectedType == "crossword_puzzle") {
      contentData = crosswordQuestionList.map((item, index) => {
        return { ...item, position: index + 1 };
      });
    }

    const quizData = {
      title: title,
      type: selectedType,
      description: description,
      dateCreated: new Date().toISOString(),
      isDeleted: false,
      featuredImage: iUrl,
      quizVideo: vUrl,
      quiz: contentData,
      author: user?.name || "Admin",
      authorID: user?.id || "admin",
    };
    console.log("🚀 ~ createQuiz ~ quizData:", quizData);
    var quizRes = null;
    if (quiz?.id) {
      await db.collection("quizzes").doc(quiz?.id).update(quizData);
      navigation.goBack();
    } else {
      quizRes = await db.collection("quizzes").add(quizData);
      if (quizRes?.id) {
        navigation.goBack();
      }
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);
    await onUploadMedias();
    if (title) {
      await createQuiz();
    }
    setIsLoading(false);
  };

  const removeIteminQuestionList = (index) => {
    console.log("🚀 ~ removeIteminQuestionList ~ index:", index);
    //let list = [...crosswordQuestionList];
    //list.splice(index, 1);
    setCrosswordQuestionList((list) => {
      let lst = [...list];
      lst.splice(index, 1);
      return [...lst];
    });
    //console.log("🚀 ~ removeIteminQuestionList ~ list:", list);
    //setCrosswordQuestionList(list);
  };

  const removeImagePuzzleQuestion = (index) => {
    console.log("🚀 ~ removeIteminQuestionList ~ index:", index);
    //let list = [...crosswordQuestionList];
    //list.splice(index, 1);
    setImagePuzzleQuestionList((list) => {
      let lst = [...list];
      lst.splice(index, 1);
      return [...lst];
    });
    //console.log("🚀 ~ removeIteminQuestionList ~ list:", list);
    //setCrosswordQuestionList(list);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <TextInput
          placeholder="Title"
          mode="outlined"
          onChangeText={(text) => setTitle(text)}
          value={title}
        />
        <Spacer size={10} />
        <TextInput
          placeholder="Description"
          mode="outlined"
          multiline
          numberOfLines={4}
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
        <Spacer size={10} />
        <Picker
          style={{
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "black",
            borderRadius: 5,
          }}
          selectedValue={selectedType}
          onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}
        >
          <Picker.Item label="Crossword Puzzle" value="crossword_puzzle" />
          <Picker.Item label="Image Puzzle" value="image_puzzle" />
        </Picker>
        <Spacer size={10} />
        {(featuredImagePath || featuredImageUrl) && (
          <LinearGradient
            colors={["#C33764", "#1D2671"]}
            style={{
              width: "100%",
              backgroundColor: "gray",
              alignItems: "center",
              alignContent: "center",
              borderRadius: 5,
            }}
          >
            <Spacer size={10} />
            <Image
              source={{ uri: featuredImagePath || featuredImageUrl }}
              style={{ width: 300, height: 300 }}
            />
            <Spacer size={10} />
            <Ionicons
              name="close-circle"
              size={30}
              color="black"
              style={{ position: "absolute", top: 5, right: 5 }}
              onPress={() => {
                setFeaturedImagePath(null);
                setFeaturedImageUrl(null);
              }}
            />
          </LinearGradient>
        )}
        <Spacer size={10} />
        <Button
          onPress={() => pickImage("featured_image")}
          mode="contained-tonal"
        >
          ADD FEATURED IMAGE
        </Button>
        <Spacer size={10} />
        {(quizVideoPath || quizVideoUrl) && (
          <LinearGradient
            colors={["#C33764", "#1D2671"]}
            style={{
              width: "100%",
              backgroundColor: "black",
              alignItems: "center",
              alignContent: "center",
              borderRadius: 5,
            }}
          >
            <Spacer size={10} />
            <Video
              ref={video}
              style={{ width: 320, height: 200 }}
              source={{
                uri: quizVideoPath || quizVideoUrl,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
            />
            <Spacer size={10} />
            <Ionicons
              name="close-circle"
              size={30}
              color="black"
              style={{ position: "absolute", top: 5, right: 5 }}
              onPress={() => {
                setQuizVideoPath(null);
                setQuizVideoUrl(null);
              }}
            />
          </LinearGradient>
        )}
        <Spacer size={10} />
        <Button onPress={() => pickVideo()} mode="contained-tonal">
          ADD QUIZ VIDEO
        </Button>
        <Spacer size={50} />
        <Headline style={{ fontWeight: "bold" }}>
          Quiz Content / Questions
        </Headline>
        <Spacer size={10} />
        {selectedType == "crossword_puzzle" && (
          <View>
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 5,
                padding: 10,
              }}
            >
              <Paragraph>crossword_puzzle</Paragraph>
              <Spacer size={10} />
              <TextInput
                placeholder="Question / Hint"
                mode="outlined"
                value={crosswordQuestionContent?.question || null}
                onChangeText={(text) =>
                  setCrosswordQuestionContent((content) => ({
                    ...content,
                    question: text,
                  }))
                }
              />
              <Spacer size={10} />
              <TextInput
                placeholder="Answer"
                mode="outlined"
                value={crosswordQuestionContent?.answer || null}
                onChangeText={(text) =>
                  setCrosswordQuestionContent((content) => ({
                    ...content,
                    answer: text,
                  }))
                }
                autoCapitalize="characters"
              />
              <Spacer size={10} />
              <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
                <TextInput
                  placeholder="Start X"
                  mode="outlined"
                  style={{ flex: 1 }}
                  value={crosswordQuestionContent?.startx || null}
                  onChangeText={(text) =>
                    setCrosswordQuestionContent((content) => ({
                      ...content,
                      startx: text,
                    }))
                  }
                  keyboardType="number-pad"
                />
                <TextInput
                  placeholder="Start Y"
                  mode="outlined"
                  style={{ flex: 1 }}
                  value={crosswordQuestionContent?.starty || null}
                  onChangeText={(text) =>
                    setCrosswordQuestionContent((content) => ({
                      ...content,
                      starty: text,
                    }))
                  }
                  keyboardType="number-pad"
                />
              </View>
              <Spacer size={10} />
              <Picker
                style={{
                  backgroundColor: "white",
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 5,
                }}
                selectedValue={selectedOrientation}
                onValueChange={(itemValue, itemIndex) =>
                  setselectedOrientation(itemValue)
                }
              >
                <Picker.Item label="Down" value="down" />
                <Picker.Item label="Across" value="across" />
              </Picker>
              <Spacer size={10} />
              <Button
                mode="contained-tonal"
                onPress={() => {
                  if (
                    crosswordQuestionContent?.question &&
                    crosswordQuestionContent?.answer &&
                    crosswordQuestionContent?.startx &&
                    crosswordQuestionContent?.starty
                  ) {
                    setCrosswordQuestionList((list) => [
                      ...list,
                      {
                        ...crosswordQuestionContent,
                        orientation: selectedOrientation,
                      },
                    ]);
                    setCrosswordQuestionContent(null);
                  } else {
                    Alert.alert("Notice", "Please fill all the fields");
                  }
                }}
              >
                ADD QUESTION
              </Button>
            </View>
            {crosswordQuestionList?.length > 0 && (
              <View style={{ width: "100%" }}>
                <Spacer size={10} />
                <LinearGradient
                  colors={["#C33764", "#1D2671"]}
                  style={{ width: "100%", borderRadius: 5, padding: 10 }}
                >
                  {crosswordQuestionList?.map((question, index) => (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          padding: 10,
                          backgroundColor: "white",
                          borderRadius: 5,
                        }}
                      >
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Text>{JSON.stringify(question)}</Text>
                        </View>
                        <Ionicons
                          name="trash-bin-sharp"
                          size={24}
                          color="#C33764"
                          onPress={() => removeIteminQuestionList(index)}
                        />
                      </View>
                      <Spacer size={10} />
                    </View>
                  ))}
                </LinearGradient>
              </View>
            )}
          </View>
        )}
        {selectedType == "image_puzzle" && (
          <View>
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: 5,
                padding: 10,
              }}
            >
              <Paragraph>image_puzzle</Paragraph>
              <Spacer size={10} />
              <TextInput
                placeholder="Question / Hint"
                mode="outlined"
                value={imagePuzzleQuestion}
                onChangeText={(text) => setImagePuzzleQuestion(text)}
              />
              <Spacer size={10} />
              <TextInput
                placeholder="Correct Answer"
                mode="outlined"
                value={imagePuzzleAnswer}
                onChangeText={(text) => setImagePuzzleAnswer(text)}
              />
              <Spacer size={10} />
              <Button
                onPress={() => pickImage("image_puzzle_image")}
                mode="contained-tonal"
              >
                ADD PUZZLE IMAGE
              </Button>
              {imagePuzzleHolder && (
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Spacer size={10} />
                  <Image
                    source={{ uri: imagePuzzleHolder }}
                    style={{ width: 250, height: 205 }}
                  />
                  <Ionicons
                    name="close-circle"
                    size={30}
                    color="black"
                    style={{ position: "absolute", top: 5, right: 5 }}
                    onPress={() => {
                      setImagePuzzleHolder(null);
                    }}
                  />
                </View>
              )}

              <Spacer size={10} />
              <Button
                mode="contained"
                onPress={() => {
                  if (
                    imagePuzzleAnswer &&
                    imagePuzzleQuestion &&
                    imagePuzzleHolder
                  ) {
                    setImagePuzzleQuestionList((list) => [
                      ...list,
                      {
                        question: imagePuzzleQuestion,
                        answer: imagePuzzleAnswer,
                        imageUrl: imagePuzzleHolder,
                      },
                    ]);
                    setImagePuzzleQuestion(null);
                    setImagePuzzleAnswer(null);
                    setImagePuzzleHolder(null);
                  } else {
                    Alert.alert("Notice", "Please fill all the fields");
                  }
                }}
              >
                ADD PUZZLE
              </Button>
            </View>
            {imagePuzzleQuestionList?.length > 0 && (
              <View style={{ width: "100%" }}>
                <Spacer size={10} />
                <LinearGradient
                  colors={["#C33764", "#1D2671"]}
                  style={{ width: "100%", borderRadius: 5, padding: 10 }}
                >
                  {imagePuzzleQuestionList?.map((question, index) => (
                    <View key={index}>
                      <View
                        style={{
                          flexDirection: "row",
                          padding: 10,
                          backgroundColor: "white",
                          borderRadius: 5,
                        }}
                      >
                        <Image
                          source={{ uri: question.imageUrl }}
                          style={{ width: 50, height: 50, marginRight: 10 }}
                        />
                        <View style={{ flex: 1, marginRight: 10 }}>
                          <Text>{JSON.stringify(question)}</Text>
                        </View>
                        <Ionicons
                          name="trash-bin-sharp"
                          size={24}
                          color="#C33764"
                          onPress={() => removeImagePuzzleQuestion(index)}
                        />
                      </View>
                      <Spacer size={10} />
                    </View>
                  ))}
                </LinearGradient>
              </View>
            )}
          </View>
        )}

        <Spacer size={50} />
        <Button
          mode="contained"
          icon={quiz?.id ? "pencil" : "plus"}
          onPress={onSubmit}
          disabled={isLoading || isUploading}
          loading={isLoading || isUploading}
        >
          {quiz?.id ? "UPDATE QUIZ" : "ADD QUIZ"}
        </Button>
        <Spacer size={50} />
        <Spacer size={50} />
      </ScrollView>
    </View>
  );
};

export default AddQuiz;

const styles = StyleSheet.create({});
