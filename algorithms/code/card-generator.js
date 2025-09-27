/**
 * Dynamic Algorithm Card Generator
 * Generates algorithm cards from base.json configuration
 */

class AlgorithmCardGenerator {
    constructor() {
        this.config = null;
        this.algorithmsContainer = null;
    }

    /**
     * Initialize the card generator
     */
    async init() {
        try {
            await this.loadConfig();
            this.algorithmsContainer = document.querySelector('.algorithms-grid');
            if (this.algorithmsContainer) {
                this.generateCards();
            }
        } catch (error) {
            console.error('Failed to initialize card generator:', error);
        }
    }

    /**
     * Load configuration from base.json
     */
    async loadConfig() {
        try {
            const response = await fetch('base.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.config = await response.json();
        } catch (error) {
            console.error('Failed to load base.json:', error);
            throw error;
        }
    }

    /**
     * Generate algorithm cards from configuration
     */
    generateCards() {
        if (!this.config || !this.algorithmsContainer) {
            console.error('Configuration or container not available');
            return;
        }

        const algorithms = this.config.categories.algorithms;
        if (!algorithms || !algorithms.subtopics) {
            console.error('Algorithms configuration not found');
            return;
        }

        // Clear existing cards
        this.algorithmsContainer.innerHTML = '';

        // Generate cards for each algorithm
        Object.values(algorithms.subtopics).forEach(subtopic => {
            if (subtopic.content && Array.isArray(subtopic.content)) {
                subtopic.content.forEach(algorithm => {
                    if (algorithm.type === 'visualization' && algorithm.status === 'active') {
                        this.createAlgorithmCard(algorithm);
                    }
                });
            }
        });
    }

    /**
     * Create a single algorithm card
     */
    createAlgorithmCard(algorithm) {
        const card = document.createElement('div');
        card.className = 'algorithm-card';
        card.onclick = () => window.location.href = algorithm.path;

        // Create features list HTML
        const featuresList = algorithm.features && algorithm.features.length > 0
            ? algorithm.features.map(feature => `<li>${feature}</li>`).join('')
            : '<li>Interactive visualization</li><li>Step-by-step learning</li><li>Interview preparation</li>';

        card.innerHTML = `
            <h3 class="algorithm-title">${algorithm.title}</h3>
            <p class="algorithm-description">${algorithm.description}</p>
            <ul class="algorithm-features">
                ${featuresList}
            </ul>
            <a href="${algorithm.path}" class="access-button">View Visualization →</a>
        `;

        this.algorithmsContainer.appendChild(card);
    }

    /**
     * Get algorithm configuration by ID
     */
    getAlgorithmConfig(algorithmId) {
        if (!this.config || !this.config.categories.algorithms) {
            return null;
        }

        const algorithms = this.config.categories.algorithms.subtopics;
        for (const subtopic of Object.values(algorithms)) {
            if (subtopic.content) {
                const algorithm = subtopic.content.find(alg => alg.id === algorithmId);
                if (algorithm) {
                    return algorithm;
                }
            }
        }
        return null;
    }

    /**
     * Get all algorithm configurations
     */
    getAllAlgorithms() {
        if (!this.config || !this.config.categories.algorithms) {
            return [];
        }

        const algorithms = [];
        const subtopics = this.config.categories.algorithms.subtopics;
        
        Object.values(subtopics).forEach(subtopic => {
            if (subtopic.content && Array.isArray(subtopic.content)) {
                subtopic.content.forEach(algorithm => {
                    if (algorithm.type === 'visualization' && algorithm.status === 'active') {
                        algorithms.push(algorithm);
                    }
                });
            }
        });

        return algorithms;
    }

    /**
     * Refresh cards (useful for dynamic updates)
     */
    refresh() {
        this.generateCards();
    }
}

// Global instance
window.algorithmCardGenerator = new AlgorithmCardGenerator();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.algorithmCardGenerator.init();
    });
} else {
    window.algorithmCardGenerator.init();
}
