import React, { useState, useEffect } from "react";

import {
  LanguageDropdown,
  DropdownOption,
  TextArea,
  CharCount,
  ButtonContainer,
  OverlayContainer,
} from "./TranslateTextArea.styles";
import {
  Button,
  Snackbar,
  Tooltip,
  Modal,
  Box,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Feedback from "../Feedback";
import FeedbackImage from "../../images/feedback.png";
// import Typewriter from "../Typewriter";
import { ContentCopy } from "@mui/icons-material";

const languageNames = {
  eng: "English",
  lug: "Luganda",
  ach: "Acholi",
  teo: "Ateso",
  lgg: "Lugbara",
  nyn: "Runyankole",
  auto: "language not detected",
};

const MAX_CHAR_COUNT = 5000;

const TranslateTextArea = ({
  placeholder,
  disabled,
  dropDownOptions,
  setSourceLanguage,
  setTargetLanguage,
  text,
  translation,
  setText,
  sourceLanguage,
  targetLanguage,
  isLoading,
  detectedLanguage,
  setAutoDetected,
  autoDetected,
  charCountLimit,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const onLanguageChange = (event) => {
    if (!disabled) {
      const selectedLanguage = event.target.value;
      console.log(`sourceLang set ${selectedLanguage}`);
      setSourceLanguage(selectedLanguage);
      setAutoDetected(selectedLanguage === "auto");
    } else {
      setTargetLanguage(event.target.value);
    }
  };

  const onTextChange = (event) => {
    const newText = event.target.value;
    if (charCountLimit && newText.length <= MAX_CHAR_COUNT) {
      setText(newText);
      setCharCount(newText.length);
    } else {
      setText(newText);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translation);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleFeedbackOpen = () => setFeedbackOpen(true);
  const handleFeedbackClose = () => setFeedbackOpen(false);

  return (
    <div className="relative p-4 bg-white shadow-md rounded-lg w-full flex flex-col items-start">
      <OverlayContainer>
        <div className="flex items-center w-full">
          <LanguageDropdown
            defaultValue="auto"
            onChange={onLanguageChange}
            value={disabled ? targetLanguage : sourceLanguage}
          >
            {dropDownOptions.map((option, index) => (
              <DropdownOption key={index} value={option.value}>
                {option.label}
              </DropdownOption>
            ))}
          </LanguageDropdown>
          {disabled && (
            <Tooltip title="Provide Feedback">
            <button
              onClick={handleFeedbackOpen}
              //disabled={translation ? false : true}
              className={`w-12 h-12 hover:opacity-50 disabled:opacity-50`}
            >
              <img
                src={FeedbackImage}
                alt="Feedback"
                //style={{ width: 40, height: 40 }}
              />
            </button>
          </Tooltip>
          )}
        </div>

        {disabled && (
          <div className="flex items-center">
            <ButtonContainer>
              <Button
                onClick={copyToClipboard}
                disabled={!translation}
                endIcon={<ContentCopy />}
                size="small"
              >
                Copy
              </Button>
            </ButtonContainer>
          </div>
        )}
      </OverlayContainer>

      {autoDetected && detectedLanguage && (
        <small className="italic text-xs text-blue-600">
          Detected : {languageNames[detectedLanguage]}
        </small>
      )}

      {isLoading && (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="success" />
        </Stack>
      )}

      <TextArea
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        value={disabled ? translation : text}
        onChange={onTextChange}
        rows={disabled ? undefined : "5"}
      />

      {charCountLimit && (
        <CharCount>
          {charCount}/{MAX_CHAR_COUNT} characters
        </CharCount>
      )}

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        message="Translation copied!"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />

      <Modal open={feedbackOpen} onClose={handleFeedbackClose}>
        <Box sx={modalStyle}>
          <Feedback
            sourceText={text}
            translation={translation}
            from={sourceLanguage}
            to={targetLanguage}
          />
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default TranslateTextArea;
