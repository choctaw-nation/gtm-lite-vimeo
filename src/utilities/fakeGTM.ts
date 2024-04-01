declare global {
	interface Window {
		dataLayer: Array<{}>;
	}
}

export default function fakeGTM() {
	window.dataLayer = [];
}
