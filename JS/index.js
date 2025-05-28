// Lista el nombre e los temas
const themes = ['light', 'dark', 'blue']
let currentTheme = 'light'
let lang = 'es'
const texts = {
    es: {
        welcome: 'Bienvenido a mi portafolio profesional',
        langBtn: 'En',
        themeBtn: 'Cambiar tema',
        themeNames: ['Claro', 'Oscuro', 'Azul']
    },
    en: {
        welcome: 'Welcome to my professional portfolio',
        langBtn: 'Es',
        themeBtn: 'Change theme',
        themeNames: ['Light', 'Dark', 'Blue']
    }
}

function setTheme(theme) {
    document.body.className = theme
    currentTheme = theme
    // Actualiza el estado activo de los botones de tema
    const themeTabs = document.querySelectorAll('.theme-selector .tab')
    themeTabs.forEach(btn => btn.classList.remove('active'))
    if(theme === 'light') themeTabs[0].classList.add('active')
    if(theme === 'dark') themeTabs[1].classList.add('active')
    if(theme === 'blue') themeTabs[2].classList.add('active')
}

document.querySelectorAll('.theme-selector .tab')[0].onclick = function() { setTheme('light') }
document.querySelectorAll('.theme-selector .tab')[1].onclick = function() { setTheme('dark') }
document.querySelectorAll('.theme-selector .tab')[2].onclick = function() { setTheme('blue') }

function setLanguage(selectedLang) {
    lang = selectedLang
    // Actualiza el estado activo de los botones de idioma
    const langTabs = document.querySelectorAll('.language-tabs .tab')
    langTabs.forEach(tab => tab.classList.remove('active'))
    if(lang === 'es') langTabs[0].classList.add('active')
    if(lang === 'en') langTabs[1].classList.add('active')
    document.getElementById('welcome').textContent = texts[lang].welcome
    // Cambia los textos de los botones de tema
    const themeTabs = document.querySelectorAll('.theme-selector .tab')
    texts[lang].themeNames.forEach((name, i) => {
        themeTabs[i].textContent = name
    })
}

// Inicializa los textos de los botones de tema según el idioma actual
setLanguage(lang)
setTheme(currentTheme)


