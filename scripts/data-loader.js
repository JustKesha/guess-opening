let animeData = [];

async function loadAnimeData() {
    try {
        const response = await fetch('data/prod.json');
        if (!response.ok) throw new Error('Failed to load anime data');
        
        const data = await response.json();
        animeData = Object.entries(data).map(([id, anime]) => ({
            id,
            ...anime
        }));
        
        console.log(`Loaded ${animeData.length} anime with openings`);
        return animeData;
    } catch (error) {
        console.error('Error loading anime data:', error);
        return [];
    }
}