import React, { useState, useEffect } from 'react';
import { generateChatResponse } from '../services/apiService';
import LoadingSpinner from './LoadingSpinner'; // Un indicateur de chargement visuel

const Chatbot = ({ onComplete }) => {
    const [conversation, setConversation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const maxQuestions = 5;

    useEffect(() => {
        // Démarrer la conversation avec un message système
        startConversation();
    }, []);

    const startConversation = () => {
        const systemMessage = "Bonjour, je suis un assistant musical intelligent. Je vais te poser quelques questions pour comprendre tes goûts musicaux. Réponds honnêtement pour que je puisse te proposer les meilleures musiques possibles. 😊";
        setConversation([{ role: 'bot', content: systemMessage }]);
    };

    const handleUserInput = async (userInput) => {
        if (questionCount >= maxQuestions) {
            setLoading(true);
            const summary = conversation.map(msg => msg.content).join(' ');
            console.log('Résumé des préférences pour la génération de musiques:', summary);

            const musicSuggestions = await generateChatResponse(summary);

            // Filtrer les suggestions pour ne garder que des titres valides
            const filteredSuggestions = musicSuggestions.split('\n').filter(suggestion => suggestion.length > 1);
            console.log('Suggestions musicales générées:', filteredSuggestions);

            setLoading(false);
            setConversation([...conversation, { role: 'bot', content: "Je vais maintenant te proposer des musiques en fonction de tes réponses." }, { role: 'bot', content: filteredSuggestions.join(', ') }]);
            onComplete(filteredSuggestions); // Transmet les suggestions de musique filtrées
            return;
        }

        setConversation([...conversation, { role: 'user', content: userInput }]);
        setLoading(true);

        const response = await generateChatResponse(userInput);
        setLoading(false);

        setConversation([...conversation, { role: 'user', content: userInput }, { role: 'bot', content: response }]);
        setQuestionCount(questionCount + 1);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const userInput = event.target.elements.userInput.value;
        event.target.elements.userInput.value = ''; // Réinitialiser le champ
        handleUserInput(userInput);
    };

    return (
        <div className="chatbot">
            <div className="chat-window">
                {conversation.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
                {loading && <LoadingSpinner />}
            </div>
            {questionCount < maxQuestions && (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="userInput" placeholder="Écris ta réponse..." required />
                    <button type="submit">Envoyer</button>
                </form>
            )}
        </div>
    );
};

export default Chatbot;
