/**
 * Message API Module
 * Handles sending contact form messages to the server
 */
class MessageAPI {
    constructor() {
        this.apiUrl = 'https://api.allstardebate.com/messages';
        // For development/demo, we'll simulate API calls
        this.isDemo = true;
    }

    /**
     * Send a message from the contact form
     * @param {Object} messageData - The message data to send
     * @returns {Promise} - Promise resolving with the response
     */
    async sendMessage(messageData) {
        try {
            // Validate the message data
            if (!messageData.name || !messageData.email || !messageData.message) {
                throw new Error('Missing required fields');
            }

            // In demo mode, simulate a successful API call
            if (this.isDemo) {
                console.log('MessageAPI: Simulating sending message', messageData);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate success response
                return {
                    success: true,
                    message: 'Your message has been sent successfully'
                };
            }

            // In production, make actual API call
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send message');
            }

            return await response.json();
        } catch (error) {
            console.error('Error in MessageAPI:', error);
            throw error;
        }
    }
}

// Create and export the messageAPI instance
export const messageAPI = new MessageAPI(); 