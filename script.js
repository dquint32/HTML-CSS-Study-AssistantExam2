fetch('studyGuide.json')
  .then(response => {
    // 1. CHECK FOR NETWORK/HTTP ERRORS (e.g., 404 Not Found, 500 Server Error)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} (${response.statusText}). Check file path and case.`);
    }
    // 2. SAFELY PARSE JSON
    return response.json();
  })
  .then(data => {
    const container = document.getElementById('card-container');
    
    // Ensure data.studyGuide exists and is an array
    if (!data.studyGuide || !Array.isArray(data.studyGuide)) {
        throw new Error("JSON structure is missing the 'studyGuide' array.");
    }

    // 3. RENDER CARDS
    data.studyGuide.forEach(concept => {
      const card = document.createElement('div');
      card.className = 'card';
      
      // Destructure nested data for easier access
      const questionData = concept.multipleChoiceQuestion;
      const codeData = concept.codeExample;
      const visualData = concept.visualConcept;
      const explanationData = concept.answerExplanation;

      // Map options to radio button labels
      const optionsHtml = questionData.options.map(opt => `
        <label class="${opt.isCorrect ? 'correct-option' : ''}">
          <input type="radio" name="${concept.conceptId}" disabled />
          ${opt.optionText}
          ${opt.isCorrect ? ' <span class="answer-indicator">✅</span>' : ''}
        </label>
      `).join('');

      card.innerHTML = `
        <h2>${concept.conceptTitle}</h2>
        <p><strong>Category:</strong> ${concept.category}</p>
        <p><strong>Question:</strong> ${questionData.questionText}</p>

        <div class="options">
          ${optionsHtml}
        </div>
        
        <div class="code-section">
            <h4>Code Example: ${codeData.description}</h4>
            
            <div class="code-block html-code">
                <strong>HTML:</strong>
                <pre><code>${codeData.html.trim()}</code></pre>
            </div>
            
            ${codeData.css ? `
            <div class="code-block css-code">
                <strong>CSS:</strong>
                <pre><code>${codeData.css.trim()}</code></pre>
            </div>
            ` : ''}
        </div>

        <div class="visual-concept">
          <strong>${visualData.title}</strong>
          <p class="snippet">${visualData.snippetOrAnalogy}</p>
          <p class="importance"><strong>Importance:</strong> ${visualData.importance}</p>
        </div>

        <div class="explanation">
            <h4>${explanationData.title}</h4>
            <p>${explanationData.text}</p>
        </div>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    // 4. DISPLAY DETAILED ERROR MESSAGE
    document.getElementById('card-container').innerHTML = `<p>⚠️ Error loading study guide: ${error.message}. Please check your browser's console (F12) for more details.</p>`;
    console.error('Fetch and Rendering Error:', error);
  });
