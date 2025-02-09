import Configuration from 'openai';
export const configureOpenAI = () => {
    const openAIConfig = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG_ID,
    });
    return openAIConfig;
};
//# sourceMappingURL=openai-config.js.map