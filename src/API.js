import pRetry from "p-retry";

const API_URL = process.env.REACT_APP_API_URL;
const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL;
const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
export const tracking_id = process.env.REACT_APP_GA4_TRACKING_ID;


export const getTranslation = async (sentence, model) => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "model": model,
            "inputs": sentence
        })
    }
    const response = await (await fetch(API_URL, requestOptions)).json();
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


const huggingFaceUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-lug-tts"

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

    const response = await fetch(huggingFaceUrl, requestOptions);

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
        retries: 5
    });
}