import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  MainContainer,
  Note,
  CloseButton,
  SplitContainer,
  NoteText,
  NoteContent,
} from "./Translate.styles";
import TranslateTextArea from "../TranslateTextArea";
import { debounce } from "lodash";
import { languageId, translateSB } from "../../API";
import SamplePhrases from "../SamplePhrases";
import { Alert, Snackbar } from "@mui/material";

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
  // Source Area States
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState(autoOption[0].value);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [autoDetected, setAutoDetected] = useState(true);

  // Translation Area States
  const [translation, setTranslation] = useState("");
  const [targetLanguage, setTargetLanguage] = useState(
    localLangOptions[1].value
  );
  const [isLoading, setIsLoading] = useState(false);

  // UI States
  const [showNote, setShowNote] = useState(true);
  const [error, setError] = useState(false);

  // Refs for tracking
  const prevTargetRef = useRef(targetLanguage);
  const isComponentMounted = useRef(true);

  // Close error snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError(false);
  };

  // Prevent same source and target language
  useEffect(() => {
    if (sourceLanguage === targetLanguage) {
      const newTargetLanguage =
        getTargetOptions(sourceLanguage)[0]?.value || localLangOptions[0].value;
      setTargetLanguage(newTargetLanguage);
    }
  }, [sourceLanguage]);

  // Language Detection
  const detectLanguage = useCallback(
    debounce(async (text) => {
      if (!text || text.trim() === "" || !autoDetected) {
        setDetectedLanguage(null);
        return;
      }

      try {
        const detected = await languageId(text.substring(0, 18));
        
        if (!isComponentMounted.current) return;

        if (detected === "language not detected") {
          setDetectedLanguage("auto");
          setSourceLanguage("auto");
          setError(true);
        } else {
          setDetectedLanguage(detected);
          
          // Only update source language if different
          if (detected !== sourceLanguage) {
            setSourceLanguage(detected);

            // Check if detected language is same as target
            if (detected === targetLanguage) {
              setError(true);
              // Automatically change target language
              const newTargetLanguage = getTargetOptions(detected)[0]?.value;
              setTargetLanguage(newTargetLanguage);
            }
          }
        }
      } catch (error) {
        console.error("Language detection error:", error);
        setDetectedLanguage(null);
      }
    }, 1000),
    [autoDetected, sourceLanguage, targetLanguage]
  );

  // Trigger language detection
  useEffect(() => {
    detectLanguage(sourceText);
  }, [sourceText, detectLanguage]);

  // Translation Logic
  const translate = useCallback(
    async (text) => {
      // Prevent translation if no text or source language is auto
      if (!text || text.trim() === "") {
        setTranslation("");
        setIsLoading(false);
        return;
      }

      // Skip translation if source language is auto
      if (sourceLanguage === "auto") {
        //setTranslation("Please select a source language");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await translateSB(
          text,
          sourceLanguage,
          targetLanguage
        );

        if (isComponentMounted.current) {
          setTranslation(result);
        }
      } catch (error) {
        console.error("Translation error:", error);
        setTranslation("Translation failed");
      } finally {
        if (isComponentMounted.current) {
          setIsLoading(false);
        }
      }
    },
    [sourceLanguage, targetLanguage]
  );

  // Trigger translation when relevant states change
  useEffect(() => {
    // Reset translation if target language changes
    if (prevTargetRef.current !== targetLanguage) {
      setTranslation("");
    }
    prevTargetRef.current = targetLanguage;

    // Debounce translation
    const timeoutId = setTimeout(() => translate(sourceText), 500);
    return () => clearTimeout(timeoutId);
  }, [sourceText, targetLanguage, sourceLanguage, translate]);

  // Hide note after timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowNote(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-fit">
      {showNote && (
        <Note
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <NoteContent>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-blue-500 mr-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <NoteText>
            Our auto language detection currently supports the following languages: 
            English, Luganda, Acholi, Ateso, Lugbara, and Runyankole. 
            We are actively working on improving this feature and adding support 
            for more languages in the future.
          </NoteText>
          <CloseButton onClick={() => setShowNote(false)}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </CloseButton>
        </NoteContent>
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
            detectedLanguage={detectedLanguage}
            setAutoDetected={setAutoDetected}
            autoDetected={autoDetected}
            charCountLimit={true}
            sourceLanguage={sourceLanguage}
            forceLanguageSelect={detectLanguage === 'auto' ? true : false}
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
            charCountLimit={false}
          />
        </SplitContainer>
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity="error"
            sx={{ width: "100%" }}
            onClose={handleClose}
          >
         {
          detectedLanguage === 'auto' || detectedLanguage === null ? "Auto detect failed. Please choose the language from the dropdown" : "Detected language is the same as the target language."
         }
          </Alert>
        </Snackbar>
        <SamplePhrases
          sourceLanguage={sourceLanguage}
          setSamplePhrase={setSourceText}
        />
      </MainContainer>
    </div>
  );
};

export default Translate;