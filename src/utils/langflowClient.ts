export class LangflowClient {
    private baseURL: string;
    private applicationToken: string;

    constructor(baseURL: string, applicationToken: string) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint: string, body: any, headers: Record<string, string> = {}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        headers["Access-Control-Allow-Origin"] = "*";
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
                mode: 'cors',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const responseMessage = await response.json();
            return responseMessage;
        } catch (error: unknown) {
            console.error('Request Error:', error);
            throw new Error(`Failed to connect to Langflow API: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async runFlow(message: string): Promise<string> {
        const flowIdOrName = '173e5667-4185-4a96-8516-b5b89a1be66b';
        const langflowId = '96f512a1-d07a-4283-9ecb-9478d59364d9';
        
        try {
            const endpoint = `/lf/${langflowId}/api/v1/run/${flowIdOrName}`;
            const response = await this.post(endpoint, {
                input_value: message,
                input_type: 'chat',
                output_type: 'chat',
                stream: false,
                tweaks: {
                    "ChatInput-sKStG": {},
                    "ParseData-cCtF5": {},
                    "Prompt-HCVgK": {},
                    "SplitText-iv53E": {},
                    "ChatOutput-CUrPq": {},
                    "AstraDB-mHUwo": {},
                    "AstraDB-zfszC": {},
                    "File-XPVNN": {},
                    "Google Generative AI Embeddings-j6KDR": {},
                    "Google Generative AI Embeddings-kUl5D": {},
                    "GoogleGenerativeAIModel-vtMUc": {}
                }
            });

            if (response?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
                return response.outputs[0].outputs[0].outputs.message.message.text;
            }
            return "Sorry, I couldn't process that request.";
        } catch (error: unknown) {
            console.error('Error running flow:', error);
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
}

// Create and export a singleton instance
export const langflowClient = new LangflowClient(
    'https://api.langflow.astra.datastax.com',
    import.meta.env.VITE_LANGFLOW_TOKEN || ''
); 