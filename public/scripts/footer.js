document.addEventListener(
	'DOMContentLoaded',
	() => {
		const yearSpan = document.getElementById('footer-current-year');
		if (yearSpan) {
			yearSpan.textContent = new Date().getFullYear();
		}
	}
);
