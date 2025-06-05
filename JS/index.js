/******************************************************
 * Tema de la pagina
******************************************************/

// Lista el nombre e los temas
const themes = ['light', 'dark', 'blue']
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
let currentTheme = prefersDark ? 'dark' : 'light'

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
    updateIconsForTheme(theme)
}

// Cambia los iconos según el tema
function updateIconsForTheme(themeName) {
    document.querySelectorAll('img[data-icon]').forEach(img => {
        const base = img.getAttribute('data-icon')
        img.src = `./assets/${base}_${themeName}.png`
    })
}

// Se asigna la funcion para cambiar el tema a los botones
document.querySelectorAll('.theme-selector .tab')[0].onclick = function() { setTheme('light') }
document.querySelectorAll('.theme-selector .tab')[1].onclick = function() { setTheme('dark') }
document.querySelectorAll('.theme-selector .tab')[2].onclick = function() { setTheme('blue') }

/******************************************************
 * Idioma de la pagina
******************************************************/

// Detecta el idioma preferido del usuario
function getPreferredLang() {
    const navLang = navigator.language || navigator.userLanguage || 'en'
    if (navLang.startsWith('es')) return 'es'
    if (navLang.startsWith('en')) return 'en'

    return 'en'
}

let lang = getPreferredLang()

import en from '../lang/en.js'
import es from '../lang/es.js'

// Para prevenir insercion de HTML no deseado, se usa una función de sanitización que solo permite etiquetas <strong>
// y se traduce directamente los textos de etiquetas <i></i>
const i18n = {
}

const translations = { en, es }

// Sanitiza el HTML permitiendo solo <strong>, <i> y <span class="...">
function sanitizeHTML(str) {
    // Escapa cualquier etiqueta no permitida
    let safe = str
        .replace(/<(?!\/?(strong|i|span)(\s|>|\/))/gi, "&lt;")
        // Permite solo el atributo class en <span>
        .replace(/<span(?!\s|>)/gi, "&lt;span")
        .replace(/<span([^>]*)>/gi, (match, attrs) => {
            const classAttr = attrs.match(/\sclass\s*=\s*["'][^"']*["']/i)
            return `<span${classAttr ? classAttr[0] : ""}>`
        })
    return safe
}

// Traduce todos los elementos con data-section y data-value
function translatePage() {
    const data = translations[lang]
    document.querySelectorAll('[data-section][data-value]').forEach(el => {
        const section = el.getAttribute('data-section')
        let value = el.getAttribute('data-value')
        // Si data-value es vacío, usa la sección como clave directa
        if (!value) value = section

        let translation
        // Soporta claves anidadas con punto y arrays
        if (value.includes('.')) {
            const parts = value.split('.')
            let ref = data?.[section]
            for (const part of parts) {
                if (Array.isArray(ref) && !isNaN(part)) {
                    ref = ref[parseInt(part, 10)]
                } else if (ref && typeof ref === 'object') {
                    ref = ref[part]
                } else {
                    ref = undefined
                    break
                }
            }
            translation = ref
        } else {
            translation = data?.[section]?.[value]
        }

        if (!translation && data?.[section]) translation = data[section][value]
        if (!translation && data[value]) translation = data[value]
        if (typeof translation === "string") {
            el.innerHTML = sanitizeHTML(translation)
        }
    })
}

// Funcion para cambiar el lenguaje de la pagina
function setLanguage(selectedLang) {
    lang = selectedLang
    // Actualiza el estado activo de los botones de idioma
    const langTabs = document.querySelectorAll('.language-tabs .tab')
    langTabs.forEach(tab => tab.classList.remove('active'))
    if(lang === 'es') langTabs[0].classList.add('active')
    if(lang === 'en') langTabs[1].classList.add('active')
    // Traduce la página
    translatePage()
    // Actualiza los títulos de las imágenes de proyectos
    updateProjectImageTitles()
}

// Se asigna la funcion para cambiar el lenguaje a los botones
document.querySelectorAll('.language-tabs .tab')[0].onclick = function() { setLanguage('es') }
document.querySelectorAll('.language-tabs .tab')[1].onclick = function() { setLanguage('en') }

// Inicializa los textos de los botones de tema según el idioma actual
setLanguage(lang)
setTheme(currentTheme)


/******************************************************
 * Navegador del header
******************************************************/

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

// Se agrega la funcion de activar el tab correcpondiente al evento scroll
window.addEventListener('scroll', activateTabOnScroll)

// Llama una vez al cargar para el estado inicial
activateTabOnScroll()

/******************************************************
 * Mostrar/ocultar imágenes extra en proyectos
******************************************************/
function getProjectImgTitle(isOpen) {
    if (lang === 'es') {
        return isOpen ? 'Ocultar imágenes' : 'Mostrar más imágenes'
    } else {
        return isOpen ? 'Hide images' : 'Show more images'
    }
}

function updateProjectImageTitles() {
    document.querySelectorAll('.projects-img-container [data-toggle-images]').forEach(img => {
        const extra = img.parentElement.querySelector('.project-images-extra')
        const isVisible = extra && extra.classList.contains('show')
        img.title = getProjectImgTitle(isVisible)
    })
}

document.querySelectorAll('.projects-img-container [data-toggle-images]').forEach(img => {
    img.style.cursor = 'pointer'
    img.title = getProjectImgTitle(false)
    img.addEventListener('click', function() {
        const extra = img.parentElement.querySelector('.project-images-extra')
        if (extra) {
            const isVisible = extra.classList.contains('show')
            extra.classList.toggle('show')
            img.title = getProjectImgTitle(!isVisible)
        }
    })
})


