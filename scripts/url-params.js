function getAnimeIdsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const idsParam = params.get('r');
    
    if (!idsParam) return null;
    
    // Split into 3-character chunks
    const ids = [];
    for (let i = 0; i < idsParam.length; i += 3) {
        const id = idsParam.slice(i, i + 3);
        if (id.length === 3) ids.push(id);
    }
    
    return ids.length > 0 ? ids : null;
}

function createShareUrl(animeIds) {
    const baseUrl = window.location.origin + window.location.pathname;
    const idsParam = animeIds.join('');
    return `${baseUrl}?r=${idsParam}`;
}