import {LanguageDropdown, TextArea} from "./TranslateTextArea.styles";
import {Button, LinearProgress} from "@mui/material";
import Feedback from "../Feedback";
import {VolumeUp, Mic, MicOff} from "@mui/icons-material";
import {localLangString} from "../../constants";



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
                               handleTextToSpeech,
                               handleSpeechToText,
                               isRecording,
                               startRecording,
                               stopRecording,
                               audioPlayer,
                               blobURL,
                           }) => {
    const onLanguageChange = (event) => {
        if (!disabled) {
            setSourceLanguage(event.target.value);
        } else setTargetLanguage(event.target.value);
    }

    const onTextChange = (event) => {
        setText(event.target.value);
    }

    return (
        <div className={disabled ? "bg-gray-100 shadow" : "bg-white shadow"}>
            <LanguageDropdown onChange={onLanguageChange}>
                {dropDownOptions.map((option, index) =>
                    <option key={index} value={option.value}>{option.label}</option>
                )}
            </LanguageDropdown>
            <TextArea
                placeholder={placeholder}
                disabled={disabled}
                readonly={disabled}
                value={disabled ? translation : text}
                onChange={onTextChange}
            >
            </TextArea>
            {!isLoading && sourceLanguage !== "English" && 
            <div className="container">
                {isRecording ? 
                (<Button
                    disabled={text !== '' && !isRecording}
                    color="error"
                    endIcon={<MicOff/>}
                    onClick={() => stopRecording()}>
                    <span className="italic text-xs"> (BETA) </span>
                </Button>)
                :
                (<Button
                    disabled={text !== '' && isRecording}
                    endIcon={<Mic/>}
                    onClick={() => startRecording()}>
                    <span className="italic text-xs"> (BETA) </span>
                </Button>)
                }
                {/* <audio className="m-2" ref={audioPlayer} src={blobURL} controls="controls" /> */}
            </div>
            }

            {isLoading && disabled && <LinearProgress color="secondary"/>}
            {!isLoading && targetLanguage === ">>lug<<" && <Button
                disabled={translation === ''}
                endIcon={<VolumeUp/>}
                onClick={() => handleTextToSpeech()}
            >
                <span className="italic text-xs"> (BETA) </span>
            </Button>
            }
            {disabled && <Feedback
                sourceText={text}
                translation={translation}
                from={sourceLanguage}
                to={targetLanguage}
            />}
        </div>
    );
};

export default TranslateTextArea;
