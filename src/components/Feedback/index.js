import {useEffect, useRef, useState} from "react";
import {Alert, Button} from "@mui/material";
import {ThumbDown, ThumbUp} from "@mui/icons-material";


const Feedback = ({text}) => {
    const [rated, setRated] = useState(false);
    const [rating, setRating] = useState(0);  // 0 -> unrated, 1 -> good, 2 -> bad.
    const [showAlert, setShowAlert] = useState(false);
    const prevText = useRef();

    useEffect(() => {
        if (prevText.current !== text) {
            setRated(false);
            setRating(0);
        }
        prevText.current = text;
    }, [text]);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
        }, 1500);

        return () => clearTimeout(timeId);
    }, [showAlert])

    const handleSubmit = (isGood) => {
        setRated(true);
        setRating(isGood ? 1 : 2);
        setShowAlert(true);
        // TODO: Send data to backend
    }

    return (
        <div>
            <p className="m-2">Please help us improve the translation quality with your feedback.</p>
            <div className="grid grid-cols-2 m-2 gap-2">
                <Button
                    variant={rating === 1 ? "contained" : "outlined"}
                    disabled={rated || text === ''}
                    endIcon={<ThumbUp/>}
                    onClick={() => handleSubmit(true)}
                >
                    Good translation
                </Button>
                <Button
                    disabled={rated || text === ''}
                    variant={rating === 2 ? "contained" : "outlined"}
                    endIcon={<ThumbDown/>}
                    onClick={() => handleSubmit(false)}
                >
                    Bad translation
                </Button>
            </div>
            {showAlert && <Alert severity="success">Thanks for the feedback</Alert>}
        </div>
    )
}

export default Feedback;
