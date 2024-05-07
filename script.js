document.addEventListener('DOMContentLoaded', function() {
  const image = document.getElementById('image');
  const tagsInput = document.getElementById('tagsInput');
  const tagSuggestions = document.getElementById('tagSuggestions');
  const saveButton = document.getElementById('saveButton');

  // Function to suggest tags
  function suggestTags(input, tagList) {
    tagSuggestions.innerHTML = '';
    const inputText = input.value.toLowerCase().trim();
    const lastWord = inputText.split(/[ ,]+/).pop(); // Get the last word after a comma or space
    if (lastWord.length > 0) {
      const suggestions = tagList.filter(tag => tag.toLowerCase().startsWith(lastWord));
      suggestions.forEach(tag => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('tag-suggestion');
        suggestion.textContent = tag;
suggestion.addEventListener('click', () => {
    const tags = input.value.trim().split(',');
    tags[tags.length - 1] = tag.trim();
    input.value = tags.join(', ').trim() + ',';
    tagSuggestions.innerHTML = '';
    input.focus();
});
        tagSuggestions.appendChild(suggestion);
      });
    }
  }

  // Load the list of tags
  fetch('tags.json')
    .then(response => response.json())
    .then(data => {
      const predefinedTags = data.tags;
      tagsInput.addEventListener('input', () => {
        suggestTags(tagsInput, predefinedTags);
      });
    })
    .catch(error => console.error('Error fetching tags:', error));

  // Load the total number of images and first image
  let currentImageIndex = 1;
  let totalImages = 0;

  function loadImage(index) {
    const imageUrl = `images/${index}.png`;
    image.src = imageUrl;
    tagsInput.value = '';
    tagSuggestions.innerHTML = '';
  }

  function saveTags() {
    const tags = tagsInput.value;
    const fileName = `${currentImageIndex}.txt`;
    const fileContent = tags;

    // Create a Blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Append the <a> element to the document and trigger the download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // Move to the next image
    currentImageIndex++;
    if (currentImageIndex > totalImages) {
      currentImageIndex = 1;
    }
    loadImage(currentImageIndex);
  }

  fetch('images/totalImages.txt')
    .then(response => response.text())
    .then(data => {
      totalImages = parseInt(data);
      loadImage(currentImageIndex);
    })
    .catch(error => console.error('Error fetching total images:', error));

  saveButton.addEventListener('click', saveTags);
});
