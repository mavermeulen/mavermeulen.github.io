// Globale variabelen
let currentPalette = {}; // Wordt gevuld bij initialisatie
let currentMode = 'automatic';
let currentColorHarmony = 'monochromatic';

// Thema variabelen
const themeToggle = document.getElementById('theme-toggle');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');

// Modal variabelen
const readabilityModal = document.getElementById('readability-modal');
const modalContent = document.getElementById('modal-content');
const modalCloseButton = document.getElementById('modal-close-button');
const modalTitleElement = document.getElementById('modal-title');
const modalParagraph1 = document.getElementById('modal-paragraph-1');
const modalParagraph2 = document.getElementById('modal-paragraph-2');


// Standaardwaarden voor de "Standaard Kleuren" sectie
const defaultStandardColors = {
    // Tekstkleuren
    'text-color-1': { hex: '#111111', label: 'Text-color-1' },
    'text-color-2': { hex: '#333333', label: 'Text-color-2' },
    'text-color-3': { hex: '#555555', label: 'Text-color-3' },
    'text-color-4': { hex: '#EEEEEE', label: 'Text-color-4' },
    'text-color-5': { hex: '#CCCCCC', label: 'Text-color-5' },
    'text-color-6': { hex: '#AAAAAA', label: 'Text-color-6' },
    // Grijstinten
    'grey-tone-1': { hex: '#F8F8F8', label: 'Grey-tone-1' },
    'grey-tone-2': { hex: '#F2F2F2', label: 'Grey-tone-2' },
    'grey-tone-3': { hex: '#DADADA', label: 'Grey-tone-3' },
    'grey-tone-4': { hex: '#999999', label: 'Grey-tone-4' },
    'grey-tone-5': { hex: '#807F7F', label: 'Grey-tone-5' },
    'grey-tone-6': { hex: '#5A5A5A', label: 'Grey-tone-6' },
    // Alerts
    'alert-danger': { hex: '#FA4747', label: 'Danger' },
    'alert-warning': { hex: '#FFBD12', label: 'Warning' },
    'alert-primary': { hex: '#28BAFD', label: 'Primary (Alert)' },
    'alert-success': { hex: '#39DF76', label: 'Success' },
    'alert-neutral': { hex: '#8E8E9A', label: 'Neutral' },
    // Bijgewerkte Globale kleuren
    'global-nav-bg-color': { hex: '#E1E1E1', label: 'Nav-bg-color' },
    'global-nav-text-color': { hex: '#333333', label: 'Nav-text-color' },
    'global-footer-color': { hex: '#F1F2DD', label: 'Footer-color' },
    'global-footer-text-color': { hex: '#4A4A4A', label: 'Footer-text-color' },
    'global-button-background-color': { hex: '#4F46E5', label: 'Button-bg-color' },
    'global-button-background-color-hover': { hex: '#4338CA', label: 'Button-bg-hover' },
    'global-button-text-color': { hex: '#FFFFFF', label: 'Button-text-color' },
    'global-site-bg-color': { hex: '#FFFFFF', label: 'Site-bg-color' }, // Hernoemd en standaard naar wit
};

// Basis ID's voor alle kleurvakken
const swatchBaseIds = [
    'primary', 'secondary', 'tertiary', 'quaternary',
    'block-1', 'block-2', 'block-3', 'block-4', 'block-5', 'block-6',
    ...Object.keys(defaultStandardColors)
];

// Mappings voor JSON import/export
const jsonTypeToIdMap = {
    "Primary": "primary", "Secondary": "secondary", "Tertiary": "tertiary", "Quaternary": "quaternary",
    "Section-bg-one": "block-1", "Section-bg-two": "block-2", "Section-bg-three": "block-3",
    "Section-bg-four": "block-4", "Section-bg-five": "block-5", "Section-bg-white": "block-6", // Label voor block-6 blijft "Section-bg-white" voor compatibiliteit
    "Text-color-1": "text-color-1", "Text-color-2": "text-color-2", "Text-color-3": "text-color-3",
    "Text-color-4": "text-color-4", "Text-color-5": "text-color-5", "Text-color-6": "text-color-6",
    "Grey-tone-1": "grey-tone-1", "Grey-tone-2": "grey-tone-2", "Grey-tone-3": "grey-tone-3",
    "Grey-tone-4": "grey-tone-4", "Grey-tone-5": "grey-tone-5", "Grey-tone-6": "grey-tone-6",
    "Danger": "alert-danger", "Warning": "alert-warning", "Primary (Alert)": "alert-primary",
    "Success": "alert-success", "Neutral": "alert-neutral",
    "Nav-bg-color": "global-nav-bg-color",
    "Nav-text-color": "global-nav-text-color",
    "Footer-color": "global-footer-color",
    "Footer-text-color": "global-footer-text-color",
    "Button-bg-color": "global-button-background-color",
    "Button-bg-hover": "global-button-background-color-hover",
    "Button-text-color": "global-button-text-color",
    "Site-bg-color": "global-site-bg-color", // Nieuwe mapping
};
const idToJsonTypeMap = Object.fromEntries(Object.entries(jsonTypeToIdMap).map(([key, value]) => [value, key]));


// --- Thema Functies ---
function applyTheme(theme) {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        if (themeIconLight) themeIconLight.classList.add('hidden');
        if (themeIconDark) themeIconDark.classList.remove('hidden');
        // Pas de donkere achtergrondkleur toe als die gedefinieerd is
        if (currentPalette && currentPalette['global-site-bg-color'] && defaultStandardColors['global-site-bg-color-dark']) { // Check of de dark variant bestaat
             // Voor nu gebruiken we de CSS :root variabelen of directe styling via html.dark
        } else {
            // Fallback als de specifieke donkere site bg niet is ingesteld in het palet
            // De .dark class op body regelt dit via CSS
        }
    } else {
        htmlElement.classList.remove('dark');
        if (themeIconLight) themeIconLight.classList.remove('hidden');
        if (themeIconDark) themeIconDark.classList.add('hidden');
        // Pas de lichte achtergrondkleur toe
        if (currentPalette && currentPalette['global-site-bg-color']) {
            bodyElement.style.backgroundColor = currentPalette['global-site-bg-color'].hex;
        }
    }
    // Update body background color based on the new global-site-bg-color and current theme
    updateBodyBackgroundColor();
}

function updateBodyBackgroundColor() {
    const bodyElement = document.body;
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
        // In dark mode, de CSS `html.dark body` regelt de achtergrond.
        // We kunnen hier eventueel een specifieke 'site-bg-dark' uit het palet gebruiken als die bestaat.
        // Voor nu laten we de CSS dit afhandelen.
        bodyElement.style.backgroundColor = ''; // Reset inline style zodat CSS class werkt
    } else {
        if (currentPalette && currentPalette['global-site-bg-color'] && currentPalette['global-site-bg-color'].hex) {
            bodyElement.style.backgroundColor = currentPalette['global-site-bg-color'].hex;
        } else {
            bodyElement.style.backgroundColor = defaultStandardColors['global-site-bg-color'].hex; // Fallback
        }
    }
}


function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
}

// --- Modal Functies ---
function openReadabilityModal(backgroundColorHex, textColorHex) {
    if (!readabilityModal || !modalContent || !modalTitleElement || !modalParagraph1 || !modalParagraph2) {
        console.error("Modal elements not found!");
        return;
    }

    modalContent.style.backgroundColor = backgroundColorHex;
    modalTitleElement.style.color = textColorHex;
    modalParagraph1.style.color = textColorHex;
    modalParagraph2.style.color = textColorHex;

    const modalBgRgb = hexToRgb(backgroundColorHex);
    if (modalBgRgb && modalCloseButton) { 
        const closeButtonContrastColor = getContrastColor(modalBgRgb[0], modalBgRgb[1], modalBgRgb[2]);
        modalCloseButton.style.color = closeButtonContrastColor;
    }

    readabilityModal.classList.remove('hidden');
    readabilityModal.classList.add('flex'); 
}

function closeReadabilityModal() {
    if (!readabilityModal) return;
    readabilityModal.classList.add('hidden');
    readabilityModal.classList.remove('flex');
}

// --- 3D Hover Effect Functie ---
function add3DHoverEffect(element) {
    const intensity = 10; 

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        const rotateY = (deltaX / centerX) * intensity;
        const rotateX = -(deltaY / centerY) * intensity; 

        element.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`; 
    });

    element.addEventListener('mouseleave', () => {
        element.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'; 
    });
}


// --- Hulpfuncties (kleurconversie, etc.) ---
function hslToRgb(h, s, l) { s /= 100; l /= 100; let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2; let r = 0, g = 0, b = 0; if (0 <= h && h < 60) { r = c; g = x; b = 0; } else if (60 <= h && h < 120) { r = x; g = c; b = 0; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; } r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255); return [r, g, b]; }
function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase(); }
function hexToRgb(hex) { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null; }
function rgbToHsl(r, g, b) { r /= 255, g /= 255, b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2; if (max === min) { h = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }; }
function getRandomInt(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }
function getLuminance(r, g, b) { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; }
function getContrastColor(r, g, b) { return getLuminance(r, g, b) > 0.5 ? '#000000' : '#FFFFFF'; }
function isValidHex(hex) { return /^#[0-9a-fA-F]{6}$/.test(hex); }
function formatRgbSpaceString(rgbArray) { return `${rgbArray[0]} ${rgbArray[1]} ${rgbArray[2]}`; }

function createColorDataFromHex(hexWithHash) {
    if (!isValidHex(hexWithHash)) return null;
    const rgb = hexToRgb(hexWithHash);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    const contrastColor = getContrastColor(rgb[0], rgb[1], rgb[2]);
    const rgbSpaceString = formatRgbSpaceString(rgb);
    return { hex: hexWithHash, rgb, hsl, contrastColor, rgbSpaceString };
}

function initializeCurrentPaletteWithDefaults() {
    currentPalette = {};
    for (const id in defaultStandardColors) {
        currentPalette[id] = createColorDataFromHex(defaultStandardColors[id].hex);
        if (!currentPalette[id]) { 
            currentPalette[id] = { hex: '#FF0000', rgb: [255,0,0], hsl: {h:0,s:100,l:50}, contrastColor: '#FFFFFF', rgbSpaceString: '255 0 0'};
        }
    }
    const dynamicParts = generateDynamicPaletteParts(null, currentColorHarmony);
    if (dynamicParts && dynamicParts.primary && dynamicParts.blocks && dynamicParts.blocks.length === 6) {
        currentPalette.primary = dynamicParts.primary;
        currentPalette.secondary = dynamicParts.secondary;
        currentPalette.tertiary = dynamicParts.tertiary;
        currentPalette.quaternary = dynamicParts.quaternary;
        currentPalette.blocks = [...dynamicParts.blocks];
        // Koppel global-site-bg-color aan block-6
        if (currentPalette.blocks[5]) {
            currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5])); // Diepe kopie
        }
    } else { 
        const fallbackDynamic = generateDynamicPaletteParts(null, 'monochromatic');
        currentPalette.primary = fallbackDynamic.primary;
        currentPalette.secondary = fallbackDynamic.secondary;
        currentPalette.tertiary = fallbackDynamic.tertiary;
        currentPalette.quaternary = fallbackDynamic.quaternary;
        currentPalette.blocks = [...fallbackDynamic.blocks];
        if (currentPalette.blocks[5]) {
            currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5]));
        }
    }
    updateBodyBackgroundColor(); // Pas body achtergrond aan na initialisatie
}

function generateDynamicPaletteParts(lockedPrimaryHsl = null, harmonyType = currentColorHarmony) {
    let primaryHue, primarySat, primaryLight;
    if (lockedPrimaryHsl) {
        primaryHue = lockedPrimaryHsl.h; primarySat = lockedPrimaryHsl.s; primaryLight = lockedPrimaryHsl.l;
    } else {
        primaryHue = getRandomInt(0, 360); primarySat = getRandomInt(60, 95); primaryLight = getRandomInt(45, 60);
    }
    const dynamicPalette = { primary: {}, secondary: {}, tertiary: {}, quaternary: {}, blocks: [] };
    function generateColor(h, s, l) {
        const hsl = { h: h % 360, s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) };
        const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        if (!rgb) return null;
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        const contrastColor = getContrastColor(rgb[0], rgb[1], rgb[2]);
        const rgbSpaceString = formatRgbSpaceString(rgb);
        return { hsl, hex, contrastColor, rgb, rgbSpaceString };
    }
    dynamicPalette.primary = generateColor(primaryHue, primarySat, primaryLight);
    if (!dynamicPalette.primary) { return generateDynamicPaletteParts(null, harmonyType); }

    switch (harmonyType) {
        case 'achromatic':
            const originalPrimaryHueForAchromatic = primaryHue;
            dynamicPalette.primary = generateColor(originalPrimaryHueForAchromatic, 0, getRandomInt(40, 60));
            dynamicPalette.secondary = generateColor(originalPrimaryHueForAchromatic, 0, Math.min(100, dynamicPalette.primary.hsl.l + 15));
            dynamicPalette.tertiary = generateColor(originalPrimaryHueForAchromatic, 0, Math.max(0, dynamicPalette.primary.hsl.l - 15));
            dynamicPalette.quaternary = generateColor(originalPrimaryHueForAchromatic, 0, getRandomInt(0, 100));
            primaryHue = originalPrimaryHueForAchromatic; primarySat = 0; primaryLight = dynamicPalette.primary.hsl.l;
            break;
        case 'direct':
            dynamicPalette.secondary = generateColor((primaryHue + 180) % 360, primarySat, primaryLight);
            dynamicPalette.tertiary = generateColor(primaryHue, Math.max(0, primarySat - 20), Math.min(100, primaryLight + 20));
            dynamicPalette.quaternary = generateColor((primaryHue + 180) % 360, Math.max(0, primarySat - 20), Math.min(100, primaryLight + 20));
            break;
        case 'split':
            const complement = (primaryHue + 180) % 360;
            dynamicPalette.secondary = generateColor((complement - 30 + 360) % 360, primarySat, primaryLight);
            dynamicPalette.tertiary = generateColor((complement + 30 + 360) % 360, primarySat, primaryLight);
            dynamicPalette.quaternary = generateColor(primaryHue, primarySat, Math.min(100, primaryLight + 30));
            break;
        case 'analogous':
            dynamicPalette.secondary = generateColor((primaryHue - 30 + 360) % 360, primarySat, primaryLight);
            dynamicPalette.tertiary = generateColor((primaryHue + 30 + 360) % 360, primarySat, primaryLight);
            dynamicPalette.quaternary = generateColor((primaryHue + 60 + 360) % 360, primarySat, primaryLight);
            break;
        case 'triadic':
            dynamicPalette.secondary = generateColor((primaryHue + 120) % 360, primarySat, primaryLight);
            dynamicPalette.tertiary = generateColor((primaryHue + 240) % 360, primarySat, primaryLight);
            dynamicPalette.quaternary = generateColor(primaryHue, Math.max(0, primarySat - 30), primaryLight);
            break;
        case 'tetradic':
            dynamicPalette.secondary = generateColor((primaryHue + 60) % 360, primarySat, primaryLight);
            dynamicPalette.tertiary = generateColor((primaryHue + 180) % 360, primarySat, primaryLight);
            dynamicPalette.quaternary = generateColor((primaryHue + 240) % 360, primarySat, primaryLight);
            break;
        case 'monochromatic':
        default:
            dynamicPalette.secondary = generateColor(primaryHue, getRandomInt(primarySat - 15, primarySat + 5), getRandomInt(primaryLight + 15, primaryLight + 30));
            dynamicPalette.tertiary = generateColor(primaryHue, getRandomInt(primarySat - 10, primarySat + 10), getRandomInt(primaryLight - 30, primaryLight - 15));
            dynamicPalette.quaternary = generateColor(primaryHue, getRandomInt(Math.max(10, primarySat - 40), primarySat - 15), Math.random() > 0.5 ? getRandomInt(20, 35) : getRandomInt(70, 85));
            break;
    }
    ['secondary', 'tertiary', 'quaternary'].forEach(key => {
        if (!dynamicPalette[key]) { dynamicPalette[key] = generateColor(primaryHue, getRandomInt(20, 80), getRandomInt(20, 80)); }
    });
    const qHue = dynamicPalette.quaternary?.hsl.h || primaryHue;
    const qSat = dynamicPalette.quaternary?.hsl.s || primarySat;
    const qLight = dynamicPalette.quaternary?.hsl.l || primaryLight;
    const pSatGen = dynamicPalette.primary.hsl.s;
    const pLightGen = dynamicPalette.primary.hsl.l;
    const pHueGen = dynamicPalette.primary.hsl.h;
    if(harmonyType === 'achromatic') {
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, getRandomInt(90, 98)));
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, getRandomInt(80, 88)));
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, getRandomInt(10, 25)));
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, getRandomInt(20, 40)));
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, getRandomInt(70, 85)));
        dynamicPalette.blocks.push(generateColor(pHueGen, 0, 100));
    } else {
        dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(5, 20), getRandomInt(93, 98)));
        dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(Math.max(15, pSatGen - 35), pSatGen - 20), getRandomInt(pLightGen - 5, pLightGen + 5)));
        if (Math.random() < 0.6) { dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(Math.max(10,pSatGen - 25), pSatGen -10), getRandomInt(15, 30))); }
        else { dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(0, 8), getRandomInt(20, 35))); }
        dynamicPalette.blocks.push(generateColor(qHue, getRandomInt(Math.max(10, qSat - 35), qSat -20), getRandomInt(Math.max(20, qLight - 30), Math.max(30, qLight -20))));
        dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(15, 30), getRandomInt(90, 96)));
        if (Math.random() < 0.15) { dynamicPalette.blocks.push(generateColor(pHueGen, getRandomInt(0, 5), getRandomInt(98, 99))); }
        else { dynamicPalette.blocks.push(generateColor(0, 0, 100)); } // Default block-6 to white
    }
    dynamicPalette.blocks = dynamicPalette.blocks.filter(Boolean);
    while (dynamicPalette.blocks.length < 6) {
        let fallbackBlock = generateColor(primaryHue, getRandomInt(5, 15), getRandomInt(90, 95));
        if (!fallbackBlock) {
            fallbackBlock = { hex: '#FAFAFA', rgb: [250,250,250], hsl: {h:0,s:0,l:98}, contrastColor: '#000000', rgbSpaceString: '250 250 250'};
        }
        dynamicPalette.blocks.push(fallbackBlock);
    }
    if (dynamicPalette.blocks.length > 6) { dynamicPalette.blocks = dynamicPalette.blocks.slice(0, 6); }
    return dynamicPalette;
}

function updateSwatchUI(baseId, colorData) {
    const swatchElementId = `${baseId}-color`;
    const swatchElement = document.getElementById(swatchElementId);
    let hexElementId, inputElementId, rgbElementId;

    if (baseId.startsWith('block-')) {
        const blockIndex = baseId.split('-')[1];
        hexElementId = `block-hex-${blockIndex}`;
        inputElementId = `block-input-${blockIndex}`;
        rgbElementId = `block-rgb-${blockIndex}`;
    } else if (baseId.startsWith('grey-tone-') || baseId.startsWith('alert-') || baseId.startsWith('global-') || baseId.startsWith('text-color-')) {
        hexElementId = `${baseId}-hex`;
        inputElementId = `${baseId}-input`;
        rgbElementId = `${baseId}-rgb`;
    } else { 
        hexElementId = `${baseId}-hex`;
        inputElementId = `${baseId}-input`;
        rgbElementId = `${baseId}-rgb`;
    }

    const hexElement = document.getElementById(hexElementId);
    const inputElement = document.getElementById(inputElementId);
    const rgbElement = document.getElementById(rgbElementId);

    if (!swatchElement || !hexElement || !inputElement || !rgbElement) {
        console.error(`Error updating UI for baseId "${baseId}": Missing elements. Swatch:${!!swatchElement}, HEX:${!!hexElement}, Input:${!!inputElement}, RGB:${!!rgbElement}`);
        return;
    }
    swatchElement.style.backgroundColor = colorData.hex;
    hexElement.textContent = colorData.hex;
    rgbElement.textContent = colorData.rgbSpaceString;
    if (document.activeElement !== inputElement) { inputElement.value = colorData.hex; }
    inputElement.classList.remove('invalid');
    const textElements = swatchElement.querySelectorAll('.swatch-text');
    textElements.forEach(el => { if (!el.classList.contains('swatch-label')) { el.style.color = colorData.contrastColor; } });
    
    hexElement.onclick = null; 
    hexElement.onclick = (event) => { event.stopPropagation(); copyToClipboard(colorData.hex.replace('#', ''), swatchElement, "HEX"); };
    
    rgbElement.onclick = null; 
    rgbElement.onclick = (event) => { event.stopPropagation(); copyToClipboard(colorData.rgbSpaceString, swatchElement, "RGB"); };

    if (baseId.startsWith('block-')) {
        const blockIndex = baseId.split('-')[1]; 
        const aaTextElement = swatchElement.querySelector('.block-aa-text');
        if (aaTextElement) {
            const correspondingTextColorId = `text-color-${blockIndex}`;
            if (currentPalette[correspondingTextColorId] && currentPalette[correspondingTextColorId].hex) {
                aaTextElement.style.color = currentPalette[correspondingTextColorId].hex;
            } else {
                aaTextElement.style.color = '#000000'; 
                console.warn(`Corresponding text color ${correspondingTextColorId} not found for ${baseId}. Aa text set to black.`);
            }
        }
    }
    
    // Als global-site-bg-color wordt bijgewerkt, update de body achtergrond
    if (baseId === 'global-site-bg-color') {
        updateBodyBackgroundColor();
    }


    const isStandardColor = defaultStandardColors.hasOwnProperty(baseId);
    if (isStandardColor) { 
        inputElement.disabled = false;
    } else { 
        if (currentMode === 'automatic') { inputElement.disabled = true; }
        else if (currentMode === 'manual') { inputElement.disabled = false; }
        else if (currentMode === 'lockPrimary') { inputElement.disabled = (baseId !== 'primary'); }
    }
}

function updateUI(paletteToDisplay) {
    if (!paletteToDisplay) { console.warn("updateUI called with no paletteToDisplay"); return; }
    swatchBaseIds.forEach(baseId => {
        let colorData;
        if (baseId.startsWith('block-')) {
            const index = parseInt(baseId.split('-')[1], 10) - 1;
            if (paletteToDisplay.blocks && paletteToDisplay.blocks[index]) {
                colorData = paletteToDisplay.blocks[index];
            } else {
                console.warn(`Block data missing for ${baseId} in paletteToDisplay.blocks:`, paletteToDisplay.blocks);
                colorData = createColorDataFromHex("#CCCCCC"); 
            }
        } else {
            colorData = paletteToDisplay[baseId];
        }

        if (colorData) {
            updateSwatchUI(baseId, colorData);
        } else {
            console.warn(`No color data for baseId: ${baseId}. Using fallback.`);
            const defaultColorInfo = defaultStandardColors[baseId];
            if (defaultColorInfo) {
                colorData = createColorDataFromHex(defaultColorInfo.hex);
            } else {
                colorData = createColorDataFromHex("#FF00FF"); 
            }
            if (colorData) {
                 updateSwatchUI(baseId, colorData);
            } else {
                console.error(`CRITICAL: Fallback color creation failed for ${baseId}`);
            }
        }
    });
    updateCombinedSwatch();
    updateBodyBackgroundColor(); // Zorg ervoor dat de body achtergrond ook wordt bijgewerkt
}


function copyToClipboard(text, swatchElement, type = "HEX") {
    if (!navigator.clipboard) { return; }
    const copyMessage = swatchElement.querySelector('.copy-message');
    navigator.clipboard.writeText(text).then(() => {
        if (copyMessage) { copyMessage.textContent = `${type} Gekopieerd!`; copyMessage.classList.add('show'); setTimeout(() => { copyMessage.classList.remove('show'); }, 1200); }
    }).catch(err => console.error(`Kon ${type} niet kopiëren: `, err));
}

function exportPaletteToJson() {
    if (!currentPalette) { alert("Genereer eerst een palet."); return; }
    const paletteNameInput = document.getElementById('palette-name');
    const paletteName = paletteNameInput.value.trim() || "Naamloos Palet";

    const colorsArray = [];
    ['primary', 'secondary', 'tertiary', 'quaternary'].forEach(id => {
        if (currentPalette[id]) {
            colorsArray.push({
                type: idToJsonTypeMap[id] || id, 
                hex: currentPalette[id].hex.replace('#', ''),
                rgb: currentPalette[id].rgbSpaceString
            });
        }
    });
    if (currentPalette.blocks && currentPalette.blocks.length === 6) {
        currentPalette.blocks.forEach((blockColor, index) => {
            const blockId = `block-${index + 1}`;
            const type = idToJsonTypeMap[blockId] || blockId; 
            if (blockColor) {
                colorsArray.push({ type: type, hex: blockColor.hex.replace('#',''), rgb: blockColor.rgbSpaceString });
            }
        });
    }
    for (const id in defaultStandardColors) { 
        if (currentPalette[id]) {
            colorsArray.push({
                type: defaultStandardColors[id].label, 
                hex: currentPalette[id].hex.replace('#',''),
                rgb: currentPalette[id].rgbSpaceString
            });
        }
    }

    const exportObject = { paletteName: paletteName, harmony: currentColorHarmony, colors: colorsArray };
    const jsonString = JSON.stringify(exportObject, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    const safeFilename = paletteName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${safeFilename || 'kleurenpalet'}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function importPaletteFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedObject = JSON.parse(e.target.result);
            if (typeof importedObject.paletteName !== 'string' || !Array.isArray(importedObject.colors)) {
                throw new Error("Ongeldige JSON structuur. 'paletteName' en 'colors' array verwacht.");
            }
            document.getElementById('palette-name').value = importedObject.paletteName;
            const harmonySelect = document.getElementById('harmony-select');
            if (importedObject.harmony && harmonySelect.querySelector(`option[value="${importedObject.harmony}"]`)) {
                harmonySelect.value = importedObject.harmony; currentColorHarmony = importedObject.harmony;
            } else { harmonySelect.value = 'monochromatic'; currentColorHarmony = 'monochromatic'; }

            const newImportedPalette = {};
            initializeCurrentPaletteWithDefaults(); 
            Object.assign(newImportedPalette, currentPalette); 

            let allColorsValid = true;
            importedObject.colors.forEach(item => {
                if (typeof item.type !== 'string' || typeof item.hex !== 'string' || typeof item.rgb !== 'string') {
                    allColorsValid = false; console.warn("Ongeldig item structuur in JSON:", item); return;
                }
                let baseId = jsonTypeToIdMap[item.type];
                if (!baseId) { 
                    for(const idKey in defaultStandardColors){
                        if(defaultStandardColors[idKey].label === item.type){
                            baseId = idKey;
                            break;
                        }
                    }
                }

                if (!baseId) { console.warn(`Onbekend kleurtype in JSON: ${item.type}`); return; }
                const colorData = createColorDataFromHex("#" + item.hex);
                if (!colorData) { allColorsValid = false; console.warn(`Ongeldige HEX ${item.hex} voor type ${item.type}`); return; }

                if (baseId.startsWith('block-')) {
                    const index = parseInt(baseId.split('-')[1], 10) - 1;
                    if (index >= 0 && index < 6) {
                        if (!newImportedPalette.blocks) newImportedPalette.blocks = new Array(6).fill(null);
                        newImportedPalette.blocks[index] = colorData;
                        // Als block-6 wordt geïmporteerd, update ook global-site-bg-color
                        if (baseId === 'block-6') {
                            newImportedPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(colorData));
                        }
                    } else {
                        allColorsValid = false; console.warn(`Ongeldige block index voor ${baseId}`);
                    }
                } else {
                    newImportedPalette[baseId] = colorData;
                     // Als global-site-bg-color wordt geïmporteerd, update ook block-6
                    if (baseId === 'global-site-bg-color') {
                        if (!newImportedPalette.blocks) newImportedPalette.blocks = new Array(6).fill(null);
                        newImportedPalette.blocks[5] = JSON.parse(JSON.stringify(colorData));
                    }
                }
            });

            const dynamicColorKeys = ['primary', 'secondary', 'tertiary', 'quaternary'];
            dynamicColorKeys.forEach(key => {
                if (!newImportedPalette[key]) { 
                    allColorsValid = false;
                    console.warn(`Hoofdkleur ${key} mist in JSON. Standaardwaarde wordt behouden of opnieuw gegenereerd indien nodig.`);
                }
            });
            if (!newImportedPalette.blocks || newImportedPalette.blocks.length !== 6 || newImportedPalette.blocks.some(b => !b)) {
                console.warn("Blokkleuren data in JSON is incompleet of ongeldig. Herstelt op basis van primaire kleur (indien beschikbaar).");
                const primaryHSLForBlockRegen = newImportedPalette.primary ? newImportedPalette.primary.hsl : null;
                const tempDynamicParts = generateDynamicPaletteParts(primaryHSLForBlockRegen, currentColorHarmony);
                newImportedPalette.blocks = tempDynamicParts.blocks;
                if (newImportedPalette.blocks[5]) { // Zorg dat global-site-bg-color gesynchroniseerd blijft
                    newImportedPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(newImportedPalette.blocks[5]));
                }
                if (!newImportedPalette.blocks || newImportedPalette.blocks.length !== 6 || newImportedPalette.blocks.some(b => !b)) {
                    allColorsValid = false; console.error("Herstel van blokkleuren mislukt.");
                }
            }

            if (!allColorsValid && !confirm("Sommige kleuren in het JSON-bestand waren ongeldig of ontbraken. Standaardwaarden worden gebruikt. Toch doorgaan met importeren?")) {
                 event.target.value = null; 
                 return; 
            }
            currentPalette = newImportedPalette;
            setMode('manual'); updateUI(currentPalette);
            if(allColorsValid) alert("Palet succesvol geïmporteerd!");
            else alert("Palet geïmporteerd met enkele aanpassingen vanwege ongeldige of missende data.");

        } catch (error) {
            console.error("Fout bij importeren JSON:", error); alert(`Fout bij importeren: ${error.message}`);
        } finally { event.target.value = null; }
    };
    reader.readAsText(file);
}


function handleHarmonyChange(event) {
    currentColorHarmony = event.target.value;
    let baseHsl = null;
    if ((currentMode === 'lockPrimary' || currentMode === 'manual') && currentPalette && currentPalette.primary) {
        baseHsl = currentPalette.primary.hsl;
    }
    const dynamicParts = generateDynamicPaletteParts(baseHsl, currentColorHarmony);
    currentPalette.primary = dynamicParts.primary;
    currentPalette.secondary = dynamicParts.secondary;
    currentPalette.tertiary = dynamicParts.tertiary;
    currentPalette.quaternary = dynamicParts.quaternary;
    currentPalette.blocks = [...dynamicParts.blocks];
    if (currentPalette.blocks[5]) { // Sync global-site-bg-color met block-6
        currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5]));
    }
    updateUI(currentPalette);
}

function setMode(newMode) {
    currentMode = newMode;
    const modeRadioToSelect = document.getElementById(`mode-${newMode.toLowerCase().replace('primary', '')}`);
    if (modeRadioToSelect) modeRadioToSelect.checked = true;


    swatchBaseIds.forEach(baseId => {
        let inputElementId = `${baseId}-input`;
        if (baseId.startsWith('block-')) {
            const blockIndex = baseId.split('-')[1]; inputElementId = `block-input-${blockIndex}`;
        } else if (baseId.startsWith('grey-tone-') || baseId.startsWith('alert-') || baseId.startsWith('global-') || baseId.startsWith('text-color-')) {
            inputElementId = `${baseId}-input`;
        }
        const inputElement = document.getElementById(inputElementId);
        if (inputElement) {
            const isStandardColor = defaultStandardColors.hasOwnProperty(baseId);
            if (isStandardColor) { 
                inputElement.disabled = false;
            } else { 
                if (currentMode === 'automatic') { inputElement.disabled = true; }
                else if (currentMode === 'manual') { inputElement.disabled = false; }
                else if (currentMode === 'lockPrimary') { inputElement.disabled = (baseId !== 'primary'); }
            }
            inputElement.classList.remove('invalid');
        }
    });
}

function handleManualInputChange(event) {
    const inputElement = event.target;
    let baseId = inputElement.id.substring(0, inputElement.id.lastIndexOf('-input'));
    const newHexWithHash = inputElement.value.startsWith('#') ? inputElement.value.toUpperCase() : '#' + inputElement.value.toUpperCase();
    if (!isValidHex(newHexWithHash)) { inputElement.classList.add('invalid'); return; }
    inputElement.classList.remove('invalid');
    const colorData = createColorDataFromHex(newHexWithHash);
    if (!colorData) return;

    if (baseId.startsWith('block-')) {
        const index = parseInt(baseId.split('-')[1], 10) - 1;
        if (currentPalette.blocks && index >= 0 && index < currentPalette.blocks.length) {
            currentPalette.blocks[index] = colorData;
            // Als block-6 verandert, update global-site-bg-color
            if (baseId === 'block-6') {
                currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(colorData));
                updateSwatchUI('global-site-bg-color', currentPalette['global-site-bg-color']);
            }
        } else {
            console.error(`Invalid block index or blocks array not initialized for ${baseId}`);
            return;
        }
    } else {
        currentPalette[baseId] = colorData;
        // Als global-site-bg-color verandert, update block-6
        if (baseId === 'global-site-bg-color') {
            if (currentPalette.blocks && currentPalette.blocks[5]) {
                currentPalette.blocks[5] = JSON.parse(JSON.stringify(colorData));
                updateSwatchUI('block-6', currentPalette.blocks[5]);
            }
        }
    }

    updateSwatchUI(baseId, colorData); 

    if (baseId === 'primary' && (currentMode === 'lockPrimary' || (currentMode === 'manual'))) {
        const dynamicParts = generateDynamicPaletteParts(colorData.hsl, currentColorHarmony);
        currentPalette.primary = dynamicParts.primary;
        currentPalette.secondary = dynamicParts.secondary;
        currentPalette.tertiary = dynamicParts.tertiary;
        currentPalette.quaternary = dynamicParts.quaternary;
        currentPalette.blocks = [...dynamicParts.blocks];
        if (currentPalette.blocks[5]) { // Sync global-site-bg-color met block-6 na regeneratie
            currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5]));
        }
        updateUI(currentPalette); 
    } 
    else if (baseId.startsWith('text-color-')) {
        const textIndex = baseId.split('-')[2]; 
        const targetBlockBaseId = `block-${textIndex}`;
        const blockSwatchElement = document.getElementById(`${targetBlockBaseId}-color`);
        
        if (blockSwatchElement && currentPalette.blocks[parseInt(textIndex, 10) - 1]) {
            const aaTextElement = blockSwatchElement.querySelector('.block-aa-text');
            if (aaTextElement) {
                aaTextElement.style.color = colorData.hex; 
            }
        }
    } 
    else {
        updateCombinedSwatch();
    }
}

function updateCombinedSwatch() {
    if (!currentPalette || !currentPalette.primary || !currentPalette.secondary || !currentPalette.tertiary || !currentPalette.quaternary || !currentPalette.blocks || currentPalette.blocks.length < 1 || !currentPalette.blocks[0] ) {
        console.warn("updateCombinedSwatch: currentPalette or essential colors/blocks missing or incomplete.");
        const segments = ['combined-segment-1', 'combined-segment-2', 'combined-segment-3', 'combined-segment-4', 'combined-segment-5'];
        segments.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.backgroundColor = '#CCCCCC';
        });
        return;
    }
    const getHex = (colorObj) => colorObj?.hex || '#CCCCCC';
    document.getElementById('combined-segment-1').style.backgroundColor = getHex(currentPalette.primary);
    document.getElementById('combined-segment-2').style.backgroundColor = getHex(currentPalette.secondary);
    document.getElementById('combined-segment-3').style.backgroundColor = getHex(currentPalette.tertiary);
    document.getElementById('combined-segment-4').style.backgroundColor = getHex(currentPalette.quaternary);
    document.getElementById('combined-segment-5').style.backgroundColor = getHex(currentPalette.blocks[0]);
}

let instructionTimeout;

function triggerPaletteGeneration() {
    let baseHsl = null;
    if (currentMode === 'lockPrimary' && currentPalette && currentPalette.primary) {
        const primaryInput = document.getElementById('primary-input');
        const primaryHexWithHash = primaryInput.value.startsWith('#') ? primaryInput.value : '#' + primaryInput.value;
        if (isValidHex(primaryHexWithHash)) {
            const colorData = createColorDataFromHex(primaryHexWithHash);
            if(colorData) {
                baseHsl = colorData.hsl;
                currentPalette.primary = colorData; 
            }
             primaryInput.classList.remove('invalid');
        } else { if(primaryInput) primaryInput.classList.add('invalid'); }
    }
    const dynamicParts = generateDynamicPaletteParts(baseHsl, currentColorHarmony);
    currentPalette.primary = dynamicParts.primary; 
    currentPalette.secondary = dynamicParts.secondary;
    currentPalette.tertiary = dynamicParts.tertiary;
    currentPalette.quaternary = dynamicParts.quaternary;
    currentPalette.blocks = [...dynamicParts.blocks];
    if (currentPalette.blocks[5]) { // Sync global-site-bg-color met block-6
        currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5]));
    }

    updateUI(currentPalette);
    const instructionElement = document.getElementById('instruction');
    if (instructionElement && !instructionElement.classList.contains('hidden')) { instructionElement.classList.add('hidden'); clearTimeout(instructionTimeout); }
}

function handleKeyPress(event) {
    const activeElement = document.activeElement;
    const isInputFocused = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT';
    if (activeElement.id === 'palette-name' && event.code === 'Space') { return; } 
    if (event.code === 'Space' && !isInputFocused) { event.preventDefault(); triggerPaletteGeneration(); }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme(); 
    document.body.tabIndex = -1; 

    initializeCurrentPaletteWithDefaults(); // Dit roept ook updateBodyBackgroundColor aan
    updateUI(currentPalette); // updateUI roept ook updateBodyBackgroundColor aan
    setMode('automatic'); 

    if (themeToggle) { 
        themeToggle.addEventListener('click', toggleTheme);
    }

    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeReadabilityModal);
    }
    if (readabilityModal) {
        readabilityModal.addEventListener('click', (event) => {
            if (event.target === readabilityModal) {
                closeReadabilityModal();
            }
        });
    }

    document.querySelectorAll('.block-aa-text').forEach(aaElement => {
        aaElement.addEventListener('click', () => {
            const blockId = aaElement.dataset.blockId; 
            const blockColorData = currentPalette.blocks[parseInt(blockId, 10) - 1];
            const textColorData = currentPalette[`text-color-${blockId}`];

            if (blockColorData && textColorData) {
                openReadabilityModal(blockColorData.hex, textColorData.hex);
            } else {
                console.error(`Kleurdata niet gevonden voor blok ${blockId} of tekstkleur text-color-${blockId}`);
                openReadabilityModal('#FFFFFF', '#000000');
            }
        });
    });

    document.querySelectorAll('.color-swatch').forEach(swatch => {
        add3DHoverEffect(swatch);
    });


    const modeRadios = document.querySelectorAll('input[name="palette-mode"]');
    modeRadios.forEach(radio => { radio.addEventListener('change', (event) => {
        const newMode = event.target.value;
        setMode(newMode);
        if (newMode === 'automatic') {
            triggerPaletteGeneration();
        } else if (newMode === 'lockPrimary' && currentPalette.primary) {
            const primaryInput = document.getElementById('primary-input');
            if (primaryInput && isValidHex(primaryInput.value)) {
                const lockedPrimaryData = createColorDataFromHex(primaryInput.value);
                if(lockedPrimaryData) {
                    const dynamicParts = generateDynamicPaletteParts(lockedPrimaryData.hsl, currentColorHarmony);
                    currentPalette.primary = dynamicParts.primary; 
                    currentPalette.secondary = dynamicParts.secondary;
                    currentPalette.tertiary = dynamicParts.tertiary;
                    currentPalette.quaternary = dynamicParts.quaternary;
                    currentPalette.blocks = [...dynamicParts.blocks];
                    if (currentPalette.blocks[5]) { // Sync global-site-bg-color met block-6
                        currentPalette['global-site-bg-color'] = JSON.parse(JSON.stringify(currentPalette.blocks[5]));
                    }
                    updateUI(currentPalette);
                }
            } else if (primaryInput) {
                primaryInput.classList.add('invalid');
            }
        }
    }); });

    const harmonySelectElement = document.getElementById('harmony-select');
    if (harmonySelectElement) { harmonySelectElement.addEventListener('change', handleHarmonyChange); }

    swatchBaseIds.forEach(baseId => {
        let inputElementId = `${baseId}-input`;
        if (baseId.startsWith('block-')) {
            const blockIndex = baseId.split('-')[1]; inputElementId = `block-input-${blockIndex}`;
        } else if (baseId.startsWith('grey-tone-') || baseId.startsWith('alert-') || baseId.startsWith('global-') || baseId.startsWith('text-color-')) {
            inputElementId = `${baseId}-input`;
        }
        const inputElement = document.getElementById(inputElementId);
        if (inputElement) {
            inputElement.addEventListener('change', handleManualInputChange);
            inputElement.addEventListener('focus', () => inputElement.classList.remove('invalid'));
            inputElement.addEventListener('blur', () => { 
                if (inputElement.classList.contains('invalid')) {
                    const hexVal = inputElement.value.startsWith('#') ? inputElement.value : '#' + inputElement.value;
                    if (isValidHex(hexVal)) {
                        inputElement.classList.remove('invalid');
                    }
                }
            });
        } else {
            console.error(`Initial load: Input element not found for derived ID ${inputElementId} (from baseId ${baseId})`);
        }
    });

    window.addEventListener('keydown', handleKeyPress);
    const exportButton = document.getElementById('export-json-button');
    if(exportButton) { exportButton.addEventListener('click', exportPaletteToJson); }

    const importButton = document.getElementById('import-json-button');
    const importInput = document.getElementById('import-json-input');
    if (importButton && importInput) {
        importButton.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', importPaletteFromJson);
    }

    const mobileGenerateBtn = document.getElementById('mobile-generate-button');
    if (mobileGenerateBtn) { mobileGenerateBtn.addEventListener('click', () => { triggerPaletteGeneration(); }); }

    const instructionElement = document.getElementById('instruction');
    if (instructionElement && instructionElement.classList.contains('hidden')) {
        instructionElement.classList.remove('hidden'); 
    }
    instructionTimeout = setTimeout(() => {
        if (instructionElement) instructionElement.classList.add('hidden');
    }, 5000);
    window.addEventListener('keydown', (event) => {
        if (event.code === 'Space') { clearTimeout(instructionTimeout); if (instructionElement && !instructionElement.classList.contains('hidden')) instructionElement.classList.add('hidden');}
    }, { once: true });
});
