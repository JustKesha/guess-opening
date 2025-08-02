class Game {
    constructor(animeList) {
        this.animeList = animeList;
        this.currentAnime = null;
        this.score = { total: 0, correct: 0 };
        this.animeQueue = [];
        this.useQueue = false;
    }

    // Set a specific queue of anime IDs to play through
    setAnimeQueue(animeIds) {
        this.animeQueue = animeIds;
        this.useQueue = true;
    }

    // Clear the queue and return to random selection
    clearQueue() {
        this.animeQueue = [];
        this.useQueue = false;
    }

    getNextAnime() {
        if (this.useQueue && this.animeQueue.length > 0) {
            // Get next anime from queue
            const nextId = this.animeQueue.shift();
            this.currentAnime = this.animeList.find(anime => anime.id === nextId);
            
            if (!this.currentAnime) {
                console.warn(`Anime with ID ${nextId} not found, skipping`);
                return this.getNextAnime(); // Skip invalid IDs
            }
            
            return this.currentAnime;
        }
        
        // Fallback to random selection
        return this.getRandomAnime();
    }

    getRandomAnime() {
        const availableAnime = this.animeList.filter(
            anime => anime.id !== this.currentAnime?.id
        );

        if (availableAnime.length === 0) {
            console.log('All anime shown, starting over');
            return this.animeList[0]; // Fallback if only 1 anime
        }

        const randomIndex = Math.floor(Math.random() * availableAnime.length);
        this.currentAnime = availableAnime[randomIndex];
        return this.currentAnime;
    }

    checkGuess(guess) {
        this.score.total++;
        const isCorrect = this.currentAnime.name.toLowerCase() === guess.toLowerCase();
        
        if (isCorrect) this.score.correct++;
        
        return {
            isCorrect,
            correctName: this.currentAnime.name,
            score: this.getScore(),
            isQueueEmpty: this.useQueue && this.animeQueue.length === 0
        };
    }

    getScore() {
        const percentage = this.score.total > 0 
            ? Math.round((this.score.correct / this.score.total) * 100) 
            : 0;
        return {
            correct: this.score.correct,
            total: this.score.total,
            percentage
        };
    }

    getVideoUrl() {
        if (!this.currentAnime?.openings?.length) return null;
        return `https://www.youtube.com/embed/${this.currentAnime.openings[0]}?controls=0&rel=0&autoplay=1`;
    }
}