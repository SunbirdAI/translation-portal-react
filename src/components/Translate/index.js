import {MainContainer} from "./Translate.styles";
import TranslateTextArea from "../TranslateTextArea";
import SamplePhrases from "../SamplePhrases";
import {useEffect, useRef, useState} from "react";
import {translateSB, sendFeedback, textToSpeech} from "../../API";

const localLangOptions = [
    {
        label: 'Luganda',
        value: 'lug'
    },
    {
        label: 'Acholi',
        value: 'ach'
    },
    {
        label: 'Ateso',
        value: 'teo'
    },
    {
        label: 'Lugbara',
        value: 'lgg'
    },
    {
        label: 'Runyankole',
        value: 'nyn'
    }
]

const englishOption = [{
    label: 'English',
    value: 'eng'
}]

const sourceOptions = [
    ...englishOption,
    ...localLangOptions
];


const getTargetOptions = (sourceLanguage) => {
    // Filter out the selected source language from all available options
    return sourceOptions.filter(option => option.value !== sourceLanguage);
};

const Translate = () => {
    const [sourceLanguage, setSourceLanguage] = useState('eng');
    const [targetLanguage, setTargetLanguage] = useState(localLangOptions[0].value);
    const [sourceText, setSourceText] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const prevTarget = useRef();
    const isMounted = useRef(false);

    useEffect(() => {
        if (sourceLanguage !== 'eng') setTargetLanguage('eng');
        else setTargetLanguage(localLangOptions[0].value);
    }, [sourceLanguage])

    const handleTextToSpeech = async () => {
        setIsLoading(true);
        try {
            await textToSpeech(translation)
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    }

    const translate = async (source) => {
        if (source === '') {
            setTranslation('');
            setIsLoading(false);
            return;
        }
        try {
            const result = await translateSB(source, sourceLanguage, targetLanguage);
            setTranslation(result);
        } catch (e) {
            // TODO: Log errors here
            setTranslation('');
        }
        setIsLoading(false);
    }
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        if (prevTarget.current !== targetLanguage) setTranslation('')
        setIsLoading(true);
        prevTarget.current = targetLanguage;
        // if(sourceText.length < 15 && sourceText.length > 0) {
        //     setTranslation('...')
        // } else setTranslation(t => t + ' ...');
        const timeOutId = setTimeout(() => translate(sourceText), 5000);
        sendFeedback(' ', sourceText, translation, sourceLanguage, targetLanguage);
        // if (sourceText.length >= 15) {
        //     setIsLoading(true);
        //     setTranslation(t => t + ' ...');
        //     translate(sourceText);
        // }
        return () => clearTimeout(timeOutId);
    }, [sourceText, targetLanguage]);

    // useEffect(() => {
    //     if (isLoading) setTranslation(t => t + ' ...');
    // }, [isLoading]);
    return (
        <MainContainer>
            <TranslateTextArea
                placeholder="Enter text"
                dropDownOptions={sourceOptions}
                setSourceLanguage={setSourceLanguage}
                text={sourceText}
                setText={setSourceText}
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
                handleTextToSpeech={handleTextToSpeech}
            />
            <SamplePhrases sourceLanguage={sourceLanguage} setSamplePhrase={setSourceText}/>
        </MainContainer>
    );
};

export default Translate;