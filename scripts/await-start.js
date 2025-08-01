// Ultimate YouTube detection that combines all methods
function handleVideoStart() {
    console.log("HELLO WORLD - Video started!");
    document.removeEventListener('click', handleClick); // Cleanup
}

// 1. Direct click detection (works even if YouTube blocks other methods)
function handleClick(event) {
    if (event.target.closest('.video-container')) {
        handleVideoStart();
    }
}

// 2. YouTube API detection
function setupYouTubeDetection() {
    const iframe = document.getElementById('opening-video');
    if (!iframe) return;

    // Method A: postMessage listener
    function checkYouTubeMessage(event) {
        try {
            // Modern YouTube format
            if (event.origin.includes('youtube.com')) {
                if (event.data?.event === 'onStateChange' && event.data?.info === 1) {
                    handleVideoStart();
                }
                // Older format
                else if (event.data === 'onYTPlayerReady') {
                    iframe.contentWindow.postMessage(
                        '{"event":"command","func":"addEventListener","args":["onStateChange"]}',
                        '*'
                    );
                }
            }
        } catch (e) {
            console.log("YouTube message error", e);
        }
    }

    // Method B: MutationObserver as last resort
    const observer = new MutationObserver(() => {
        if (iframe.classList.contains('ytp-playing-mode')) {
            handleVideoStart();
            observer.disconnect();
        }
    });

    // Start all detectors
    window.addEventListener('message', checkYouTubeMessage);
    observer.observe(iframe, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('click', handleClick);
}

// Start detection when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupYouTubeDetection);
} else {
    setupYouTubeDetection();
}