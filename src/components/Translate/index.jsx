import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MainContainer,
  Note,
  CloseButton,
  SplitContainer,
} from "./Translate.styles";
import TranslateTextArea from "../TranslateTextArea";
import { debounce } from "lodash";
import { languageId, translateSB } from "../../API";
import SamplePhrases from "../SamplePhrases";

const localLangOptions = [
  { label: "English", value: "eng" },
  { label: "Luganda", value: "lug" },
  { label: "Acholi", value: "ach" },
  { label: "Ateso", value: "teo" },
  { label: "Lugbara", value: "lgg" },
  { label: "Runyankole", value: "nyn" },
];

const autoOption = [{ label: "Auto detection", value: "auto" }];
const sourceOptions = [...autoOption, ...localLangOptions];

const getTargetOptions = (sourceLanguage) =>
  localLangOptions.filter((option) => option.value !== sourceLanguage);

const Translate = () => {
  const [sourceLanguage, setSourceLanguage] = useState(autoOption[0].value);
  const [targetLanguage, setTargetLanguage] = useState(
    localLangOptions[1].value
  );
  const [sourceText, setSourceText] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [language, setLanguage] = useState("");
  const [autoDetected, setAutoDetected] = useState(true);
  const [charCountLimit, setCharCountLimit] = useState(true);
  const [showNote, setShowNote] = useState(true);
  const prevTarget = useRef();
  const isMounted = useRef(false);
  const isComponentMounted = useRef(true);

  useEffect(() => {
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (sourceLanguage === targetLanguage) {
      const newTargetLanguage =
        getTargetOptions(sourceLanguage)[0]?.value || localLangOptions[0].value;
      setTargetLanguage(newTargetLanguage);
    }
  }, [sourceLanguage]);

  const detectLanguage = useCallback(
    debounce(async (text) => {
      if (text === "") {
        // setSourceLanguage('auto');
        return;
      }
      try {
        if (autoDetected) {
          const detectedLanguage = await languageId(text.substring(0, 18));
          if (isComponentMounted.current) {
            if (detectedLanguage === "language not detected") {
              setLanguage("auto");
              setSourceLanguage("auto");
            } else {
              setDetectedLanguage(detectedLanguage);
              setLanguage(detectedLanguage);
              setSourceLanguage(detectedLanguage);

              if (detectedLanguage === targetLanguage) {
                setTranslation(
                  "Detected language is the same as the target language."
                );
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000),
    [autoDetected, targetLanguage]
  );

  useEffect(() => {
    detectLanguage(sourceText);
  }, [sourceText, detectLanguage]);

  const translate = useCallback(
    async (sourceText) => {
      if (sourceText.trim() === "") {
        setTranslation("");
        setIsLoading(false);
        return;
      }
      try {
        if (sourceLanguage === "auto") {
          setTranslation("");
          setIsLoading(false);
          console.log("loading is false");
          // return;
        } else {
          setIsLoading(true);
          console.log("loading is true");
          const result = await translateSB(
            sourceText,
            sourceLanguage,
            targetLanguage
          );
          if (isComponentMounted.current) {
            setTranslation(result);
            setIsLoading(false);
          }
        }
      } catch (e) {
        if (isComponentMounted.current) {
          setTranslation("");
        }
        console.error(e);
      }
      if (isComponentMounted.current) {
        setIsLoading(false);
        console.log("loading is false");
      }
    },
    [sourceLanguage, targetLanguage]
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (prevTarget.current !== targetLanguage) {
      setTranslation("");
    }
    // setIsLoading(true);
    // console.log("loading is true")
    prevTarget.current = targetLanguage;

    const timeOutId = setTimeout(() => translate(sourceText), 500);
    return () => clearTimeout(timeOutId);
  }, [sourceText, targetLanguage, sourceLanguage, translate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNote(false);
    }, 9999); // Hide the note after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showNote && (
        <Note>
          Note: Our auto language detection currently supports the following
          languages: English, Luganda, Acholi, Ateso, Lugbara, and Runyankole.
          We are actively working on improving this feature and adding support
          for more languages in the future.
          <CloseButton onClick={() => setShowNote(false)}>✖</CloseButton>
        </Note>
      )}
      <MainContainer>
        <SplitContainer>
          <TranslateTextArea
            placeholder="Enter text"
            dropDownOptions={sourceOptions}
            setSourceLanguage={setSourceLanguage}
            text={sourceText}
            setText={setSourceText}
            detectedLanguage={language}
            setAutoDetected={setAutoDetected}
            autoDetected={autoDetected}
            charCountLimit={charCountLimit}
          />
          <TranslateTextArea
            placeholder="Translation"
            disabled={true}
            dropDownOptions={getTargetOptions(sourceLanguage)}
            setTargetLanguage={setTargetLanguage}
            translation={translation}
            text={sourceText}
            sourceLanguage={sourceLanguage}
            targetLanguage={targetLanguage}
            isLoading={isLoading}
            showCopyButton={true}
          />
        </SplitContainer>
        <SamplePhrases
          sourceLanguage={sourceLanguage}
          setSamplePhrase={setSourceText}
        />
      </MainContainer>
    </div>
  );
};

export default Translate;
