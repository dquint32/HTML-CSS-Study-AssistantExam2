fetch('studyGuide.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('card-container');
    data.studyGuide.forEach(concept => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h2>${concept.conceptTitle}</h2>
        <p><strong>Category:</strong> ${concept.category}</p>
        <p><strong>Question:</strong> ${concept.question}</p>
        <div class="options">
          ${concept.options.map(opt => `
            <label>
              <input type="radio" name="${concept.conceptId}" />
              ${opt.label}
            </label>
          `).join('')}
        </div>
        <div class="code-block">${concept.codeExample}</div>
        <div class="visual-concept">
          <strong>Visual Concept:</strong> ${concept.visualConcept}
        </div>
        <p><strong>Explanation:</strong> ${concept.answerExplanation}</p>
      `;
      container.appendChild(card);
    });
  })
  .catch(error => {
    document.getElementById('card-container').innerHTML = `<p>Error loading study guide.</p>`;
    console.error('Error:', error);
  });
