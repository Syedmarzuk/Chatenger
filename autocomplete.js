// Custom Autocomplete Component
class CustomAutocomplete {
    constructor(inputSelector, options = {}) {
        this.input = document.querySelector(inputSelector);
        this.suggestions = options.suggestions || [];
        this.dropdown = null;
        this.activeIndex = -1;
        this.config = {
            showLabel: true,
            label: 'Suggestions',
            ...options
        };
        
        this.init();
    }

    init() {
        this.createDropdown();
        this.setupEventListeners();
    }

    createDropdown() {
        // Create dropdown container
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-autocomplete';
        this.dropdown.setAttribute('role', 'listbox');
        
        // Add label if enabled
        if (this.config.showLabel) {
            const label = document.createElement('div');
            label.className = 'autocomplete-label';
            label.textContent = this.config.label;
            this.dropdown.appendChild(label);
        }
        
        // Create suggestions list
        this.suggestionsList = document.createElement('ul');
        this.suggestionsList.className = 'suggestions-list';
        this.dropdown.appendChild(this.suggestionsList);
        
        // Insert after input field
        this.input.parentNode.insertBefore(this.dropdown, this.input.nextSibling);
    }

    setupEventListeners() {
        // Input events
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('focus', this.showDropdown.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
        
        // Keyboard navigation
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Click outside to close
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    handleInput(e) {
        const value = e.target.value.toLowerCase();
        this.activeIndex = -1;
        
        // Filter suggestions
        const filtered = this.suggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(value)
        );
        
        this.renderSuggestions(filtered);
        
        // Show dropdown if there are matches
        this.dropdown.classList.toggle('show', filtered.length > 0);
    }

    renderSuggestions(suggestions) {
        this.suggestionsList.innerHTML = '';
        
        suggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.className = 'suggestion-item';
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            
            // Left icon (checkmark)
            const leftIcon = document.createElement('span');
            leftIcon.className = 'left-icon';
            leftIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            `;
            
            // Text content
            const text = document.createElement('span');
            text.className = 'suggestion-text';
            text.textContent = suggestion;
            
            // Right icon (edit)
            const rightIcon = document.createElement('span');
            rightIcon.className = 'right-icon';
            rightIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            `;
            
            // Assemble item
            li.appendChild(leftIcon);
            li.appendChild(text);
            li.appendChild(rightIcon);
            
            // Click handler
            li.addEventListener('click', () => {
                this.selectSuggestion(suggestion);
                this.hideDropdown();
            });
            
            // Hover effect
            li.addEventListener('mouseenter', () => {
                this.activeIndex = index;
                this.highlightActive();
            });
            
            this.suggestionsList.appendChild(li);
        });
    }

    selectSuggestion(suggestion) {
        this.input.value = suggestion;
        this.input.focus();
        
        // Update active index and highlight
        this.activeIndex = Array.from(this.suggestionsList.children).findIndex(
            item => item.querySelector('.suggestion-text').textContent === suggestion
        );
        this.highlightActive();
    }

    highlightActive() {
        const items = Array.from(this.suggestionsList.children);
        
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.activeIndex);
            item.setAttribute('aria-selected', index === this.activeIndex);
        });
    }

    handleKeyDown(e) {
        if (!this.dropdown.classList.contains('show')) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.activeIndex = Math.min(this.activeIndex + 1, this.suggestionsList.children.length - 1);
                this.highlightActive();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.activeIndex = Math.max(this.activeIndex - 1, 0);
                this.highlightActive();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.activeIndex >= 0) {
                    const selected = this.suggestionsList.children[this.activeIndex]
                        .querySelector('.suggestion-text').textContent;
                    this.selectSuggestion(selected);
                    this.hideDropdown();
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                break;
        }
    }

    showDropdown() {
        if (this.suggestionsList.children.length > 0) {
            this.dropdown.classList.add('show');
        }
    }

    hideDropdown() {
        this.dropdown.classList.remove('show');
        this.activeIndex = -1;
    }

    handleBlur(e) {
        // Delay to allow click events on suggestions
        setTimeout(() => {
            this.hideDropdown();
        }, 200);
    }

    handleClickOutside(e) {
        if (!this.dropdown.contains(e.target) && e.target !== this.input) {
            this.hideDropdown();
        }
    }
}

// Initialize with sample data
const emailInput = document.getElementById('email');
if (emailInput) {
    new CustomAutocomplete('#email', {
        suggestions: ['test1@example.com', 'user@apple.com', 'another@domain.com', 'demo@google.com', 'info@microsoft.com'],
        label: 'Email Suggestions'
    });
}
