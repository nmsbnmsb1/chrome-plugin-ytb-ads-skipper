//https://github.com/tientq64/userscripts/tree/main/scripts/Auto-Skip-YouTube-Ads

function skipAd() {
    if (checkIsYouTubeShorts()) return

    // This element appears when a video ad appears.
    let adShowing = document.querySelector('.ad-showing')
    if (!adShowing) return

    let adVideo = document.querySelector(
        '#ytd-player video.html5-main-video, #song-video video.html5-main-video'
    )
    if (!adVideo || !adVideo.src || isNaN(adVideo.duration)) return
    //if (adVideo.currentTime >= adVideo.duration) return
    //document.querySelector("button[class='ytp-skip-ad-button ytp-ad-component--clickable']"
    //无法通过click方法点击跳过按钮，只能等待广告自动结束
    adVideo.currentTime = adVideo.duration;

    // console.table({
    //     message: 'Ad video',
    //     video: adVideo !== null,
    //     src: adVideo?.src,
    //     paused: adVideo?.paused,
    //     currentTime: adVideo?.currentTime,
    //     duration: adVideo?.duration,
    //     timeStamp: getCurrentTimeString()
    // })
    // console.log({
    //     message: 'Ad video has finished loading',
    //     timeStamp: getCurrentTimeString()
    // })
}

function checkIsYouTubeShorts() {
    return location.pathname.startsWith('/shorts/')
}

function getCurrentTimeString() {
    return new Date().toTimeString().split(' ', 1)[0]
}

function addCss() {
    const adsSelectors = [
        // Ad banner in the upper right corner, above the video playlist.
        '#player-ads',
        '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',

        // Masthead ad on home page.
        '#masthead-ad',

        // Sponsored ad video items on home page.
        // 'ytd-ad-slot-renderer',

        // '.ytp-suggested-action',
        '.yt-mealbar-promo-renderer',

        // Featured product ad banner at the bottom left of the video.
        '.ytp-featured-product',

        // Products shelf ad banner below the video description.
        'ytd-merch-shelf-renderer',

        // YouTube Music Premium trial promotion dialog, bottom left corner.
        'ytmusic-mealbar-promo-renderer',

        // YouTube Music Premium trial promotion banner on home page.
        'ytmusic-statement-banner-renderer'
    ]
    const adsSelector = adsSelectors.join(',')
    const css = `${adsSelector} { display: none !important; }`
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
}

/**
 * Remove ad elements using JavaScript because these selectors require the use of the CSS
 * `:has` selector which is not supported in older browser versions.
 */
function removeAdElements() {
    const adSelectors = [
        // Sponsored ad video items on home page.
        // ['ytd-rich-item-renderer', '.ytd-ad-slot-renderer'],

        // ['ytd-rich-section-renderer', '.ytd-statement-banner-renderer'],

        // Ad videos on YouTube Shorts.
        ['ytd-reel-video-renderer', '.ytd-ad-slot-renderer']

        // Ad blocker warning dialog.
        // ['tp-yt-paper-dialog', '#feedback.ytd-enforcement-message-view-model'],

        // Survey dialog on home page, located at bottom right.
        // ['tp-yt-paper-dialog', ':scope > ytd-checkbox-survey-renderer'],

        // Survey to rate suggested content, located at bottom right.
        // ['tp-yt-paper-dialog', ':scope > ytd-single-option-survey-renderer']
    ]
    for (const adSelector of adSelectors) {
        const adEl = document.querySelector(adSelector[0])
        if (adEl === null) continue
        const neededEl = adEl.querySelector(adSelector[1])
        if (neededEl === null) continue
        adEl.remove()
    }
}

const isYouTubeMobile = location.hostname === 'm.youtube.com'
const isYouTubeDesktop = !isYouTubeMobile

const isYouTubeMusic = location.hostname === 'music.youtube.com'
const isYouTubeVideo = !isYouTubeMusic

addCss()

if (isYouTubeVideo) {
    window.setInterval(removeAdElements, 1000)
    removeAdElements()
}

//window.setInterval(skipAd, 500)
skipAd()

const observer = new MutationObserver(skipAd)
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class'],
    childList: true,
    subtree: true
})