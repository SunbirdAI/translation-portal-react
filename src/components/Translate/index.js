import {MainContainer} from "./Translate.styles";
import TranslateTextArea from "../TranslateTextArea";
import SamplePhrases from "../SamplePhrases";
import {useEffect, useRef, useState} from "react";
import {translateHF, sendFeedback, textToSpeech, speechToText} from "../../API";
import {localLangString} from "../../constants";
import MicRecorder from "mic-recorder-to-mp3"

const localLangOptions = [
    {
        label: 'Luganda',
        value: '>>lug<<'
    },
    {
        label: 'Acholi',
        value: '>>ach<<'
    },
    {
        label: 'Ateso',
        value: '>>teo<<'
    },
    {
        label: 'Lugbara',
        value: '>>lgg<<'
    },
    {
        label: 'Runyankole',
        value: '>>nyn<<'
    }
]

const englishOption = {
    label: 'English',
    value: 'English'
}

const sourceOptions = [
    englishOption,
    {
        label: localLangString,
        value: localLangString
    }
];

const getTargetOptions = (sourceLanguage) => {
    return sourceLanguage === localLangString ? [englishOption] : localLangOptions
}


const Translate = () => {
    const [sourceLanguage, setSourceLanguage] = useState('English');
    const [targetLanguage, setTargetLanguage] = useState(localLangOptions[0].value);
    const [sourceText, setSourceText] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const prevTarget = useRef();
    const isMounted = useRef(false);

    // Mic-Recorder-To-MP3
    const recorder = useRef(null) //Recorder
    const audioPlayer = useRef(null) //Ref for the HTML Audio Tag
    const [blobURL, setBlobUrl] = useState(null)
    const [audioFile, setAudioFile] = useState(null)
    const [isRecording, setIsRecording] = useState(null)

    useEffect(() => {
        if (sourceLanguage === localLangString) setTargetLanguage('English');
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

    const handleSpeechToText = async (audio) => {
        setIsLoading(true);
        try {
            setSourceText(await speechToText(audio));
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
            const model = sourceLanguage === 'English' ? 'en-mul' : 'mul-en';
            const sentence = model === 'en-mul' ? `${targetLanguage}${source}` : source;
            const result = await translateHF(sentence, model);
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

    // Mic-Recorder-To-MP3
    useEffect(() => {
        recorder.current = new MicRecorder({ bitRate: 128 })
    }, [])
    
    const startRecording = () => {
        // Check if recording isn't blocked by browser
        recorder.current.start().then(() => {
          setIsRecording(true)
        })
    }

    const stopRecording = () => {
        recorder.current
          .stop()
          .getMp3()
          .then(([buffer, blob]) => {
            const file = new File(buffer, "audio.mp3", {
              type: blob.type,
              lastModified: Date.now(),
            })
            const newBlobUrl = URL.createObjectURL(blob)
            setBlobUrl(newBlobUrl)
            setIsRecording(false)
            setAudioFile(file)
            handleSpeechToText(audioFile)
          })
          .catch((e) => console.log(e))
    }

    return (
        <MainContainer>
            <TranslateTextArea
                placeholder="Enter text"
                dropDownOptions={sourceOptions}
                setSourceLanguage={setSourceLanguage}
                text={sourceText}
                setText={setSourceText}
                isRecording={isRecording}
                startRecording={startRecording}
                stopRecording={stopRecording}
                handleSpeechToText={handleSpeechToText}
                audioPlayer={audioPlayer}
                blobURL={blobURL}
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
