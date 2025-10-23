document.addEventListener('DOMContentLoaded', () => {
    fetch('studyGuide.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('card-container');
            data.studyGuide.forEach(concept => {
                const card = document.createElement('div');
                card.className = 'card';
                card.id = concept.conceptId;

                // Build the multiple-choice options HTML
                const optionsHTML = concept.multipleChoiceQuestion.options.map((opt, index) => `
                    <label class="option-label">
                        <input type="radio" name="${concept.conceptId}_quiz" data-correct="${opt.isCorrect}" value="${index}" />
                        <span class="option-text">${opt.optionText}</span>
                    </label>
                `).join('');

                // The complete card structure using backticks (`) for the template literal
                card.innerHTML = `
                    <h2 class="concept-title">${concept.conceptTitle}</h2>
                    <p class="category-tag"><strong>Category:</strong> ${concept.category}</p>

                    <div class="quiz-section">
                        <p class="question-text">${concept.multipleChoiceQuestion.questionText}</p>
                        <div class="options">
                            ${optionsHTML}
                        </div>
                        <button class="check-answer-btn">Check Answer</button>
                        <div class="feedback-area"></div>
                    </div>

                    <div class="hint-section">
                        <button class="toggle-hint-btn">Show Hint / Visual Concept</button>
                        <div class="hint-content hidden">
                            <div class="code-block">
                                <h3>Code Example</h3>
                                <div class="code-pair">
                                    <h4>HTML</h4>
                                    <pre><code>${concept.codeExample.html}</code></pre>
                                </div>
                                <div class="code-pair">
                                    <h4>CSS</h4>
                                    <pre><code>${concept.codeExample.css}</code></pre>
                                </div>
                            </div>
                            
                            <div class="visual-concept">
                                <h3>Visual Concept: ${concept.visualConcept.title}</h3>
                                <p class="analogy"><strong>Analogy/Snippet:</strong> ${concept.visualConcept.snippetOrAnalogy}</p>
                                <p class="importance"><strong>Importance:</strong> ${concept.visualConcept.importance}</p>
                            </div>
                        </div>
                    </div>

                    <div class="explanation-section hidden">
                        <h3>${concept.answerExplanation.title}</h3>
                        <p>${concept.answerExplanation.text}</p>
                    </div>
                `;
                
                container.appendChild(card);
            });

            // --- Add Event Listeners for Interactivity ---
            document.querySelectorAll('.check-answer-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const card = event.target.closest('.card');
                    const selectedOption = card.querySelector('input[type="radio"]:checked');
                    const feedbackArea = card.querySelector('.feedback-area');
                    const explanationSection = card.querySelector('.explanation-section');
                    const options = card.querySelectorAll('.option-label');

                    // Reset state
                    feedbackArea.textContent = '';
                    feedbackArea.classList.remove('correct', 'incorrect');
                    explanationSection.classList.add('hidden');
                    options.forEach(opt => opt.classList.remove('correct-choice', 'incorrect-choice'));

                    if (!selectedOption) {
                        feedbackArea.textContent = 'Please select an answer first.';
                        return;
                    }

                    if (selectedOption.getAttribute('data-correct') === 'true') {
                        feedbackArea.textContent = '✅ Correct! Well done!';
                        feedbackArea.classList.add('correct');
                        selectedOption.closest('.option-label').classList.add('correct-choice');
                        explanationSection.classList.remove('hidden'); // Show explanation on correct
                    } else {
                        feedbackArea.textContent = '❌ Incorrect. Review the hint or explanation.';
                        feedbackArea.classList.add('incorrect');
                        selectedOption.closest('.option-label').classList.add('incorrect-choice');
                        
                        // Highlight the correct answer
                        card.querySelector('input[data-correct="true"]').closest('.option-label').classList.add('correct-choice');

                        explanationSection.classList.remove('hidden'); // Show explanation on incorrect
                    }
                });
            });

            document.querySelectorAll('.toggle-hint-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const hintContent = event.target.nextElementSibling;
                    hintContent.classList.toggle('hidden');
                    if (hintContent.classList.contains('hidden')) {
                        event.target.textContent = 'Show Hint / Visual Concept';
                    } else {
                        event.target.textContent = 'Hide Hint / Visual Concept';
                    }
                });
            });

        })
        .catch(error => {
            document.getElementById('card-container').innerHTML = `
                <p style="color: red; font-weight: bold;">
                    ⚠️ Error loading study guide: Check console for details.
                </p>`;
            console.error('Error loading study guide:', error);
        });
});
