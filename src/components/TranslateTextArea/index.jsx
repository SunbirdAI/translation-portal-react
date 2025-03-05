import {
  LanguageDropdown,
  DropdownOption,
  TextArea,
  TranslateFooter,
  ButtonContainer,
  OverlayContainer,
} from "./TranslateTextArea.styles";
import { Button, Snackbar, Tooltip, Modal, Box, Alert } from "@mui/material";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import Feedback from "../Feedback";
import FeedbackImage from "../../images/feedback.png";
// import Typewriter from "../Typewriter";
import { ContentCopy } from "@mui/icons-material";
import React, { useState, useEffect } from "react";

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
  forceLanguageSelect = false,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (charCount >= MAX_CHAR_COUNT) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [charCount]);

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
    } else if (!charCountLimit) {
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
    <div className="relative p-4 bg-white border rounded-md w-full flex flex-col items-start">
      <OverlayContainer>
        <div className="flex items-center w-full">
          <LanguageDropdown
            defaultValue="auto"
            onChange={onLanguageChange}
            value={disabled ? targetLanguage : sourceLanguage}
          >
            {dropDownOptions.map((option, index) => (
              <DropdownOption
                key={index}
                value={option.value}
              >
                {option.label}
              </DropdownOption>
            ))}
          </LanguageDropdown>
        </div>
      </OverlayContainer>

      {autoDetected && detectedLanguage && (
        <small
          className="italic text-xs text-blue-600"
        >
          Detected : {languageNames[detectedLanguage]}
        </small>
      )}

      {isLoading && (
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="success" data-testid="loading-indicator" />
        </Stack>
      )}

      <TextArea
        placeholder={placeholder}
        disabled={disabled}
        readOnly={disabled}
        value={disabled ? translation : text}
        onChange={onTextChange}
        rows={disabled ? undefined : "5"}
        maxLength={text ? MAX_CHAR_COUNT : undefined}
      />

      <TranslateFooter>
        {charCountLimit && (
          <p
            className={`${
              disabled && "hidden"
            } text-xs text-[#666] text-center`}
          >
            {charCount}/{MAX_CHAR_COUNT} characters
          </p>
        )}

        {translation && (
          <>
            <Tooltip title="Provide Feedback" data-testid="feedback-button">
              <button
                onClick={handleFeedbackOpen}
                //disabled={translation ? false : true}
                className={`w-10 h-10 hover:opacity-50 disabled:opacity-50`}
              >
                <img
                  src={FeedbackImage}
                  alt="Feedback"
                  //style={{ width: 40, height: 40 }}
                />
              </button>
            </Tooltip>

            <ButtonContainer data-testid="copy-container">
              <Button
                onClick={copyToClipboard}
                disabled={!translation}
                endIcon={<ContentCopy />}
                size="small"
              >
                Copy
              </Button>
            </ButtonContainer>
          </>
        )}
      </TranslateFooter>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity="success"
          // variant="filled"
          sx={{ width: "100%" }}
          //onClose={handleClose}
        >
          Translation copied!
        </Alert>
      </Snackbar>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          severity="info"
          // variant="filled"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          Your text has reached the 5,000 character limit.
        </Alert>
      </Snackbar>

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
