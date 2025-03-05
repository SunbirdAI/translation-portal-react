import React from 'react';

import { useEffect, useRef, useState } from "react";
import { Alert, Button, TextField, Grid2, Typography, Box } from "@mui/material";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { sendFeedback } from "../../API";

const Feedback = ({ sourceText, translation, from, to }) => {
    const [rated, setRated] = useState(false);
    const [rating, setRating] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const prevText = useRef();
    const [correctTranslation, setCorrectTranslation] = useState('');
    const [username, setUsername] = useState('break-the-system-user');
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (prevText.current !== translation) {
            setRated(false);
            setRating(0);
        }
        prevText.current = translation;
    }, [translation]);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
        }, 1500);
        return () => clearTimeout(timeId);
    }, [showAlert]);

    const handleSubmit = async (isGood) => {
        setRated(true);
        setRating(isGood ? 1 : 2);
        setShowAlert(true);
        try {
            await sendFeedback(isGood ? 'Good' : 'Bad', correctTranslation, username, sourceText, translation, from, to);
            setCorrectTranslation('');
            setShowDialog(false);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Feedback</Typography>
            <Typography variant="body2" gutterBottom>Please help us improve the translation quality with your feedback.</Typography>
            <Grid2 container spacing={2}>
                <Grid2 item xs={12} sm={6}>
                    <Button
                        variant={rating === 1 ? "contained" : "outlined"}
                        disabled={rated || translation === ''}
                        endIcon={<ThumbUp />}
                        onClick={() => handleSubmit(true)}
                        fullWidth
                    >
                        Good translation
                    </Button>
                </Grid2>
                <Grid2 item xs={12} sm={6}>
                    <Button
                        disabled={rated || translation === ''}
                        variant={rating === 2 ? "contained" : "outlined"}
                        endIcon={<ThumbDown />}
                        onClick={() => setShowDialog(true)}
                        fullWidth
                    >
                        Bad translation
                    </Button>
                </Grid2>
            </Grid2>
            {showAlert && <Alert className="mt-4" severity="success">Thanks for the feedback</Alert>}
            {showDialog && (
                <Box mt={2}>
                    <TextField
                        label="Correct Translation"
                        multiline
                        rows={4}
                        placeholder="Enter correct translation"
                        value={correctTranslation}
                        onChange={(e) => setCorrectTranslation(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        label="Username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit(false)}
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Submit Feedback
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Feedback;
