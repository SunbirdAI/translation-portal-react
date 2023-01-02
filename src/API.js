import pRetry from "p-retry";

const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL;
const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
export const tracking_id = process.env.REACT_APP_GA4_TRACKING_ID;

const textToSpeechUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-lug-tts";
const speechToTextUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-asr";
const multipleToEnglishUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-mul-en";
const englishToMultipleUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-en-mul";


export const getTranslation = async (sentence, model) => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "inputs": sentence
        })
    }

    let url = model === 'en-mul' ? englishToMultipleUrl : multipleToEnglishUrl;
    const response = await (await fetch(url, requestOptions)).json();
    return response[0]["generated_text"];
}

export const sendFeedback = async (feedback, sourceText, translation, from, to) => {
    const time = Date.now();
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            Timestamp: time,
            feedback: feedback,
            SourceText: sourceText,
            LanguageFrom: from,
            LanguageTo: to,
            TranslatedText: translation
        })
    }
    const response = await (await fetch(FEEDBACK_URL, requestOptions)).json();
    return response;
}

const getTextFromSpeech = async (audio) => {
    const data = {
        "inputs": audio
    };
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(speechToTextUrl, requestOptions);

    // if (!response.ok) {
    //     throw new Error(response.statusText);
    // }

    // return response;
    return "Sample text";
}

const getSpeech = async (text) => {
    const data = {
        "inputs": text
    };
    console.log(data);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`
        },
        body: JSON.stringify(data)
    };

    const response = await fetch(textToSpeechUrl, requestOptions);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    const reader = response.body.getReader();

    const stream = new ReadableStream({
        start(controller) {

            return pump();

            function pump() {
                return reader.read().then(({done, value}) => {
                    if (done) {
                        // When no more data needs to be consumed, close the stream
                        controller.close();
                        return;
                    }
                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                    return pump();
                });
            }
        }
    });
    const responseBlob = new Response(stream);
    let url = window.URL.createObjectURL(await responseBlob.blob());
    window.audio = new Audio();
    window.audio.src = url;
    await window.audio.play();
}

export const textToSpeech = async (text) => {
    await pRetry(() => getSpeech(text), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: 7
    });
}

export const speechToText = async (audio) => {
    const response = await pRetry(() => getTextFromSpeech(audio), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: 2
    });

    return response;
}

export const translateHF = async (sentence, model) => {
    return await pRetry(() => getTranslation(sentence, model), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: 7
    })
};
