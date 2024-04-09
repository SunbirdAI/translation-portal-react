import pRetry from "p-retry";

const FEEDBACK_URL = process.env.REACT_APP_FEEDBACK_URL;
const HUGGING_FACE_API_KEY = process.env.REACT_APP_HUGGING_FACE_API_KEY;
export const tracking_id = process.env.REACT_APP_GA4_TRACKING_ID;

const translationUrl = `${process.env.REACT_APP_SB_API_URL}/tasks/nllb_translate`;
const textToSpeechUrl = "https://api-inference.huggingface.co/models/Sunbird/sunbird-lug-tts";

export const getTranslation = async (text, sourceLang, targetLang) => {
    let requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_SB_API_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "source_language": sourceLang,
            "target_language": targetLang,
            "text": text
        })
    };

    let translatedText = "";

    try {
        let response = await fetch(translationUrl, requestOptions);
        if (response.status === 200) {
            let responseJson = await response.json();
            translatedText = responseJson.output.data.translated_text;
        } else {
            let errorMsg = `${response.status} ${response.statusText}`;
            console.log(errorMsg);
            throw new Error(errorMsg);
        }
    } catch (err) {
        console.log(err);
        return "Translation error";
    }

    return translatedText;
}

export const sendFeedback = async (feedback, CorrectTranslation, username, sourceText, translation, from, to) => {
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
            username: username,
            CorrectTranslation: CorrectTranslation,
            TranslatedText: translation
        })
    }
    const response = await (await fetch(FEEDBACK_URL, requestOptions)).json();
    return response;
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

export const translateSB = async (text, sourceLang, targetLang) => {
    return await pRetry(() => getTranslation(text, sourceLang, targetLang), {
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: 7
    })
};
