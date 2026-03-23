import type DetachedWindowAPI from 'happy-dom/lib/window/DetachedWindowAPI.js'

// https://github.com/capricorn86/happy-dom/wiki/Setup-as-Test-Environment
// =============================================================================================
// If you are using Typescript and you wish to be able to access the happyDOM property globally
// you can achieve this by creating a type definition file for your project.
declare global {
	var happyDOM: DetachedWindowAPI | undefined
}
