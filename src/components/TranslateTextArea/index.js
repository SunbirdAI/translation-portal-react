import {LanguageDropdown, TextArea} from "./TranslateTextArea.styles";
import {CircularProgress, LinearProgress} from "@mui/material";

// TODO: Replace dropdown with react select

const TranslateTextArea = ({
                               placeholder,
                               disabled,
                               dropDownOptions,
                               setSourceLanguage,
                               setTargetLanguage,
                               text,
                               translation,
                               setText,
                               isLoading
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
            {isLoading && disabled && <LinearProgress color="secondary"/>}
        </div>
    );
};

export default TranslateTextArea;