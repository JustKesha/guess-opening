document.addEventListener('DOMContentLoaded', async () => {
    // DOM Elements
    const videoFrame = document.getElementById('opening-video');
    const guessInput = document.getElementById('guess-input');
    const suggestionsDiv = document.getElementById('suggestions');
    const submitButton = document.getElementById('submit-guess');
    const resultMessage = document.getElementById('result-message');
    const scoreDisplay = document.getElementById('score');
    const blurOverlay = document.getElementById('blur-overlay');
    const queueIndicator = document.getElementById('queue-indicator');

    const skipDelaySec = 7;
    const maxSuggestions = 25;

    // Game State
    let game;
    let animeList = [];
    let filteredSuggestions = [];

    // Initialize game
    async function initGame() {
        animeList = await loadAnimeData();
        if (animeList.length === 0) {
            alert('Failed to load anime data. Please try again later.');
            return;
        }

        game = new Game(animeList);
        
        // Check for URL params
        const animeIds = getAnimeIdsFromUrl();
        if (animeIds) {
            game.setAnimeQueue(animeIds);
            queueIndicator.textContent = `Playing custom queue (${animeIds.length} anime)`;
            queueIndicator.style.display = 'block';
        } else {
            queueIndicator.style.display = 'none';
        }
        
        loadNextAnime();
    }

    // Load a new anime opening
    function loadNextAnime() {
        const anime = game.getNextAnime();
        const videoUrl = game.getVideoUrl();
        
        if (videoUrl) {
            videoFrame.src = videoUrl;
        } else {
            console.error('No video URL found for anime:', anime);
            // Skip to next if current has no video
            setTimeout(loadNextAnime, 1000);
            return;
        }
        
        // Reset UI
        guessInput.value = '';
        suggestionsDiv.style.display = 'none';
        // resultMessage.textContent = '';
        // resultMessage.className = '';
        resultMessage.classList.add("hidden");
        blurOverlay.classList.remove("off");
        
        // Update queue indicator if in queue mode
        if (game.useQueue) {
            const remaining = game.animeQueue.length;
            queueIndicator.textContent = `Queue: ${remaining + 1} remaining`;
        }
    }

    // Handle guess submission
    function handleGuess() {
        const guess = guessInput.value.trim();
        if (!guess) return;

        const result = game.checkGuess(guess);
        const score = game.getScore();

        // Update UI with result
        resultMessage.classList.add("shown");
        blurOverlay.classList.add("off");
        if (result.isCorrect) {
            resultMessage.textContent = 'Correct!';
            resultMessage.className = 'correct';
        } else {
            resultMessage.innerHTML = `It was ${result.correctName}`;
            resultMessage.className = 'incorrect';
        }

        // Update score
        scoreDisplay.innerHTML = `Guessed ${score.correct} out of ${score.total} <span class="extra"> or ${score.percentage}%</span>`;

        // Check if queue ended
        if (result.isQueueEmpty) {
            queueIndicator.textContent = 'Custom queue completed!';
            resultMessage.classList.add("hidden");
        } else {
            // Load next anime after delay
            setTimeout(loadNextAnime, 1000 * skipDelaySec);
        }
    }

    // Show suggestions based on input
    function showSuggestions() {
        const input = guessInput.value.toLowerCase();
        if (!input) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        filteredSuggestions = animeList.filter(anime => 
            anime.name.toLowerCase().includes(input)
        ).slice(0, maxSuggestions);

        if (filteredSuggestions.length > 0) {
            suggestionsDiv.innerHTML = filteredSuggestions.map(anime => `
                <div class="suggestion-item">${anime.name}</div>
            `).join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    }

    // Event listeners
    guessInput.addEventListener('input', showSuggestions);
    
    suggestionsDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-item')) {
            guessInput.value = e.target.textContent;
            suggestionsDiv.style.display = 'none';
        }
    });

    submitButton.addEventListener('click', handleGuess);
    
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.guess-container')) {
            suggestionsDiv.style.display = 'none';
        }
    });

    // Start the game
    initGame();
});