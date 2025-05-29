// Lista el nombre e los temas
const themes = ['light', 'dark', 'blue']
let currentTheme = 'dark'
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

// Funcion para cambiar el tema de la pagina
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

// Se asigna la funcion para cambiar el tema a los botones
document.querySelectorAll('.theme-selector .tab')[0].onclick = function() { setTheme('light') }
document.querySelectorAll('.theme-selector .tab')[1].onclick = function() { setTheme('dark') }
document.querySelectorAll('.theme-selector .tab')[2].onclick = function() { setTheme('blue') }

// Funcion para cambiar el lenguaje de la pagina
function setLanguage(selectedLang) {
    lang = selectedLang
    // Actualiza el estado activo de los botones de idioma
    const langTabs = document.querySelectorAll('.language-tabs .tab')
    langTabs.forEach(tab => tab.classList.remove('active'))
    if(lang === 'es') langTabs[0].classList.add('active')
    if(lang === 'en') langTabs[1].classList.add('active')
    // Cambia los textos de acurdo al idioma seleccionado
    document.getElementById('welcome').textContent = texts[lang].welcome
    // Cambia los textos de los botones de tema
    const themeTabs = document.querySelectorAll('.theme-selector .tab')
    texts[lang].themeNames.forEach((name, i) => {
        themeTabs[i].textContent = name
    })
}

// Se asigna la funcion para cambiar el lenguaje a los botones
document.querySelectorAll('.language-tabs .tab')[0].onclick = function() { setLanguage('es') }
document.querySelectorAll('.language-tabs .tab')[1].onclick = function() { setLanguage('en') }

// Inicializa los textos de los botones de tema según el idioma actual
setLanguage(lang)
setTheme(currentTheme)

// Lista de secciones de la app
const sectionTabMap = [
    { selector: '.profile', tab: '[data-target="profile"]' },
    { selector: '.about-me', tab: '[data-target="about-me"]' },
    { selector: '.skills', tab: '[data-target="skills"]' },
    { selector: '.projects', tab: '[data-target="projects"]' },
    { selector: '.education', tab: '[data-target="education"]' }
]

// Navegación por tabs de secciones
document.querySelectorAll('.topics-buttons .tab').forEach(tab => {
    tab.onclick = function() {
        // Quitar activo de todos
        document.querySelectorAll('.topics-buttons .tab').forEach(t => t.classList.remove('active'))
        // Activar el actual
        tab.classList.add('active')
        // Hacer scroll a la sección
        const section = document.querySelector('.' + tab.dataset.target)
        if (section) {
            const top = section.getBoundingClientRect().top + window.pageYOffset - 60
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }
})

// Activa el tab según la sección visible
function activateTabOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset
    const header = document.querySelector('header')
    const offset = header ? header.offsetHeight + 12 : 60
    let found = false
    for (let i = sectionTabMap.length - 1; i >= 0; i--) {
        const section = document.querySelector(sectionTabMap[i].selector)
        if (section) {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset - 10
            if (scrollY >= sectionTop) {
                document.querySelectorAll('.topics-buttons .tab').forEach(t => t.classList.remove('active'))
                const tab = document.querySelector('.topics-buttons ' + sectionTabMap[i].tab)
                if (tab) tab.classList.add('active')
                found = true
                break
            }
        }
    }
    // Si no se encontró ninguna (está arriba del todo), activa el primero
    if (!found) {
        document.querySelectorAll('.topics-buttons .tab').forEach(t => t.classList.remove('active'))
        const firstTab = document.querySelector('.topics-buttons [data-target="profile"]')
        if (firstTab) firstTab.classList.add('active')
    }
}


window.addEventListener('scroll', activateTabOnScroll)

// Llama una vez al cargar para el estado inicial
activateTabOnScroll()


