function getContrastColor(hex) {
	hex = hex.replace('#', '');

	const r = parseInt(hex.substr(0, 2), 16);
	const g = parseInt(hex.substr(2, 2), 16);
	const b = parseInt(hex.substr(4, 2), 16);

	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	return brightness > 125 ? '#000000' : '#ffffff';
}



// Initialize Sortable instance once
const sortable = new Sortable(document.getElementById('sortableList'), {
	animation: 150,
	ghostClass: 'ghost',
	disabled: false
});

const lockBtn = document.getElementById('lockBtn');

lockBtn.addEventListener('click', () => {
    const isDisabled = sortable.option('disabled');
    sortable.option('disabled', !isDisabled);

    lockBtn.textContent = !isDisabled ? '🔒 Locked' : '🔓 Unlock';
});

// Create a tooltip element (hidden by default)
const tooltip = document.createElement('div');
tooltip.textContent = 'Unlock to move items';
tooltip.style.position = 'absolute';
tooltip.style.backgroundColor = 'rgba(0,0,0,0.75)';
tooltip.style.color = '#fff';
tooltip.style.padding = '5px 10px';
tooltip.style.borderRadius = '4px';
tooltip.style.fontSize = '12px';
tooltip.style.pointerEvents = 'none';
tooltip.style.transition = 'opacity 0.3s ease';
tooltip.style.opacity = '0';
tooltip.style.zIndex = '1000';
document.body.appendChild(tooltip);

function showTooltip(x, y) {
	tooltip.style.left = `${x + 10}px`;
	tooltip.style.top = `${y + 10}px`;
	tooltip.style.opacity = '1';

	// Hide after 1.5 seconds
	clearTimeout(tooltip.hideTimeout);
	tooltip.hideTimeout = setTimeout(() => {
		tooltip.style.opacity = '0';
	}, 770);
}

// Intercept drag start event on sortable container
document.getElementById('sortableList').addEventListener('dragstart', (event) => {
	if (sortable.option('disabled')) {
		// Prevent drag
		event.preventDefault();

		// Show tooltip near the mouse pointer
		showTooltip(event.clientX, event.clientY);
	}
});

function addListItem() {
	const text = document.getElementById('newItemText').value.trim();
	const iconClass = document.getElementById('iconSelect').value;
	const bgColor = document.getElementById('iconColorPicker').value;
	const textColor = getContrastColor(bgColor);

	if (!text) return;

	const newItem = document.createElement('div');
	newItem.className = 'icon-circle';
	newItem.style.backgroundColor = bgColor;
	newItem.style.color = textColor;

	newItem.innerHTML = `
		<i class="fas ${iconClass}"></i> <span class="item-text">${text}</span>
		<button class="edit-btn" title="Edit item">✏️</button>
		<button class="delete-btn" title="Delete item">&times;</button>
	`;

	document.getElementById('sortableList').appendChild(newItem);
	document.getElementById('newItemText').value = '';
}


document.getElementById('sortableList').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const item = e.target.closest('.icon-circle');
        if (item) item.remove();
    }
});

document.getElementById('sortableList').addEventListener('click', (e) => {
	const item = e.target.closest('.icon-circle');

	// Delete button
	if (e.target.classList.contains('delete-btn')) {
		if (item) item.remove();
	}

	// Edit button
	if (e.target.classList.contains('edit-btn')) {
		if (!item) return;

		const icon = item.querySelector('i');
		const textSpan = item.querySelector('.item-text');

		// Replace with form controls
		const currentText = textSpan.textContent;
		const currentIcon = [...icon.classList].find(cls => cls.startsWith('fa-'));
		const currentBg = item.style.backgroundColor;
		const currentColor = item.style.color;

		item.innerHTML = `
			<select class="edit-icon">
				<option value="fa-bell">🔔 Notification</option>
				<option value="fa-envelope">✉️ Message</option>
				<option value="fa-user">👤 Profile</option>
				<option value="fa-cog">⚙️ Settings</option>
				<option value="fa-star">⭐ Favorite</option>
				<option value="fa-heart">❤️ Heart</option>
			</select>
			<input type="text" class="edit-text" value="${currentText}">
			<input type="color" class="edit-color" value="${rgbToHex(currentBg)}">
			<button class="save-btn">✅</button>
		`;

		item.querySelector(`.edit-icon option[value="${currentIcon}"]`).selected = true;
	}

	// Save edited item
	if (e.target.classList.contains('save-btn')) {
		const newIcon = item.querySelector('.edit-icon').value;
		const newText = item.querySelector('.edit-text').value.trim();
		const newColor = item.querySelector('.edit-color').value;
		const contrast = getContrastColor(newColor);

		item.innerHTML = `
			<i class="fas ${newIcon}"></i> <span class="item-text">${newText}</span>
			<button class="edit-btn" title="Edit item">✏️</button>
			<button class="delete-btn" title="Delete item">&times;</button>
		`;

		item.style.backgroundColor = newColor;
		item.style.color = contrast;
	}
});
