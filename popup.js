document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', () => {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = 'Save button clicked! (No data saved yet)';
        
        setTimeout(() => {
            statusDiv.textContent = '';
        }, 2500);
    });
});
