class LynxSearch {
  constructor() {
    this.searchInput = null;
    this.searchContainer = null;
    this.autocompleteList = null;
    this.searchData = new Map();
    this.isSearchDataLoaded = false;
    this.currentPage = this.getCurrentPageName();
    this.init();
  }

  getCurrentPageName() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop() || 'home.html';
    return fileName.replace('.html', '');
  }

  init() {
    this.createSearchBar();
    this.attachEventListeners();
    this.loadSearchData();
  }

  createSearchBar() {
    // Find the navbar
    const navbar = document.querySelector('.navbar .nav-right') || 
                   document.querySelector('.header .header-left') ||
                   document.querySelector('.header');
    
    if (!navbar) return;

    // Create search container
    this.searchContainer = document.createElement('div');
    this.searchContainer.className = 'lynx-search-container';
    this.searchContainer.innerHTML = `
      <div class="lynx-search-wrapper">
        <input 
          type="text" 
          class="lynx-search-input" 
          placeholder="Search across all pages..."
          autocomplete="off"
        />
        <button class="lynx-search-clear" aria-label="Clear search">×</button>
        <div class="lynx-search-autocomplete">
          <ul class="lynx-search-suggestions"></ul>
          <div class="lynx-search-no-results" style="display: none;">
            <p>No results found for your search.</p>
            <small>Try different keywords or browse our pages directly.</small>
          </div>
        </div>
      </div>
    `;

    // Insert search bar before theme toggle or at appropriate position
    const themeToggle = document.querySelector('#theme-toggle') || 
                       document.querySelector('.theme-toggle');
    
    if (themeToggle && navbar.contains(themeToggle)) {
      navbar.insertBefore(this.searchContainer, themeToggle);
    } else {
      navbar.appendChild(this.searchContainer);
    }

    // Get references
    this.searchInput = this.searchContainer.querySelector('.lynx-search-input');
    this.autocompleteList = this.searchContainer.querySelector('.lynx-search-suggestions');
    this.noResultsDiv = this.searchContainer.querySelector('.lynx-search-no-results');
    this.clearButton = this.searchContainer.querySelector('.lynx-search-clear');

    this.addSearchStyles();
  }

  addSearchStyles() {
    if (document.getElementById('lynx-search-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'lynx-search-styles';
    styles.textContent = `
      .lynx-search-container {
        position: relative;
        margin-right: 12px;
        z-index: 1002;
      }

      .lynx-search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .lynx-search-input {
        width: 280px;
        padding: 8px 40px 8px 12px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--nav-text, #fff);
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
      }

      .lynx-search-input::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      .lynx-search-input:focus {
        outline: none;
        border-color: var(--lynx-yellow, #ffe066);
        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 0 0 3px rgba(255, 224, 102, 0.2);
      }

      .lynx-search-clear {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: none;
      }

      .lynx-search-clear:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--lynx-yellow, #ffe066);
      }

      .lynx-search-input:not(:placeholder-shown) + .lynx-search-clear {
        display: block;
      }

      .lynx-search-autocomplete {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--lynx-card, #fff);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        max-height: 400px;
        overflow-y: auto;
        display: none;
        margin-top: 4px;
        backdrop-filter: blur(10px);
        z-index: 1003;
      }

      .lynx-search-autocomplete.show {
        display: block;
      }

      .lynx-search-suggestions {
        list-style: none;
        margin: 0;
        padding: 8px 0;
      }

      .lynx-search-suggestion {
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        transition: background 0.2s ease;
      }

      .lynx-search-suggestion:last-child {
        border-bottom: none;
      }

      .lynx-search-suggestion:hover,
      .lynx-search-suggestion.highlighted {
        background: rgba(0, 120, 215, 0.1);
      }

      .lynx-search-suggestion-title {
        font-weight: 600;
        color: var(--lynx-dark, #23272a);
        margin-bottom: 4px;
        font-size: 0.9rem;
      }

      .lynx-search-suggestion-content {
        font-size: 0.8rem;
        color: #666;
        line-height: 1.4;
      }

      .lynx-search-suggestion-page {
        font-size: 0.75rem;
        color: var(--lynx-blue, #0078d7);
        margin-top: 4px;
        font-weight: 500;
      }

      .lynx-search-no-results {
        padding: 20px 16px;
        text-align: center;
        color: #666;
      }

      .lynx-search-no-results p {
        margin: 0 0 8px 0;
        font-weight: 500;
      }

      .lynx-search-no-results small {
        opacity: 0.8;
      }

      /* Dark mode styles */
      body.dark-mode .lynx-search-input {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.2);
        color: #f3f3f3;
      }

      body.dark-mode .lynx-search-input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }

      body.dark-mode .lynx-search-autocomplete {
        background: var(--lynx-card, #2d2d2d);
        border-color: rgba(255, 255, 255, 0.1);
      }

      body.dark-mode .lynx-search-suggestion-title {
        color: #f3f3f3;
      }

      body.dark-mode .lynx-search-suggestion-content {
        color: #a0aec0;
      }

      body.dark-mode .lynx-search-suggestion:hover,
      body.dark-mode .lynx-search-suggestion.highlighted {
        background: rgba(255, 224, 102, 0.1);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .lynx-search-input {
          width: 200px;
          font-size: 0.85rem;
        }
      }

      @media (max-width: 480px) {
        .lynx-search-container {
          margin-right: 8px;
        }
        
        .lynx-search-input {
          width: 160px;
          padding: 6px 35px 6px 10px;
        }
      }

      /* For home page specific styling */
      .header .lynx-search-container {
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
      }

      @media (max-width: 768px) {
        .header .lynx-search-container {
          position: static;
          transform: none;
          margin: 12px 0;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  attachEventListeners() {
    if (!this.searchInput) return;

    // Input events
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.searchInput.addEventListener('focus', () => {
      if (this.searchInput.value.trim()) {
        this.showAutocomplete();
      }
    });

    // Clear button
    this.clearButton.addEventListener('click', () => {
      this.clearSearch();
    });

    // Keyboard navigation
    this.searchInput.addEventListener('keydown', (e) => {
      this.handleKeyNavigation(e);
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.searchContainer.contains(e.target)) {
        this.hideAutocomplete();
      }
    });
  }

  async loadSearchData() {
    if (this.isSearchDataLoaded) return;

    const pages = [
      { name: 'home', title: 'Home', url: 'home.html' },
      { name: 'food', title: 'Food Delivery', url: 'food.html' },
      { name: 'taxi', title: 'Taxi Services', url: 'taxi.html' },
      { name: 'instructions', title: 'Instructions & How-To', url: 'Instructions.html' },
      { name: 'wellness-spa', title: 'Wellness & Spa Access', url: 'wellness-spa.html' },
      { name: 'guidebooks', title: 'What to Do Around', url: 'guidebooks.html' },
      { name: 'check-out', title: 'Check-in & Checkout', url: 'check-out.html' },
      { name: 'house-rules', title: 'House Rules', url: 'house-rules.html' }
    ];

    for (const page of pages) {
      try {
        if (page.name === this.currentPage) {
          // For current page, extract content directly
          this.extractCurrentPageContent(page);
        } else {
          // For other pages, we'll create searchable content based on known structure
          this.createSearchableContent(page);
        }
      } catch (error) {
        console.warn(`Failed to load search data for ${page.name}:`, error);
      }
    }

    this.isSearchDataLoaded = true;
  }

  extractCurrentPageContent(page) {
    const content = [];
    
    // Extract from main content areas
    const mainContent = document.querySelector('.main-content') || 
                       document.querySelector('main') || 
                       document.body;

    // Get headings and their associated content
    const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title, .section-title');
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (text) {
        content.push({
          title: text,
          content: this.getFollowingContent(heading),
          page: page.title,
          url: page.url,
          type: 'heading'
        });
      }
    });

    // Get card content
    const cards = mainContent.querySelectorAll('.card, .section-card');
    cards.forEach(card => {
      const title = card.querySelector('.card-title, .section-text')?.textContent.trim();
      const content_text = card.textContent.trim();
      if (title && content_text) {
        content.push({
          title: title,
          content: content_text.substring(0, 200) + '...',
          page: page.title,
          url: page.url,
          type: 'card'
        });
      }
    });

    this.searchData.set(page.name, content);
  }

  createSearchableContent(page) {
    const contentMap = {
      'home': [
        { title: 'Food Delivery', content: 'Order from trusted delivery apps including Wolt, kliknijadi.mk, and more during your stay.', type: 'service' },
        { title: 'Taxi Services', content: 'Reliable transportation options including RedTaxi, Naxi, and other taxi services in Skopje.', type: 'service' },
        { title: 'Instructions & How-To', content: 'Complete guide for your apartment stay including check-in, amenities, and helpful tips.', type: 'service' },
        { title: 'Wellness & Spa Access', content: 'Access to wellness facilities, spa services, and relaxation amenities.', type: 'service' },
        { title: 'What to Do Around', content: 'Discover local attractions, restaurants, shopping, and entertainment near your apartment.', type: 'service' },
        { title: 'Check-in & Checkout', content: 'Step-by-step instructions for arrival, departure, and key management.', type: 'service' },
        { title: 'House Rules', content: 'Important guidelines and policies for your stay at Lynx Apartment.', type: 'service' }
      ],
      'food': [
        { title: 'Wolt', content: 'Popular food delivery app with wide restaurant selection and fast delivery to your apartment.', type: 'service' },
        { title: 'kliknijadi.mk', content: 'Local Macedonian food delivery service offering restaurants and fast food options.', type: 'service' },
        { title: 'Delivery Address', content: 'Boulevard Serbia 31, Cevahir Sky City, Tower C, Floor 11, Apartment 109', type: 'info' },
        { title: 'Food Delivery Services', content: 'Multiple food delivery options available for your convenience during your stay.', type: 'service' }
      ],
      'taxi': [
        { title: 'RedTaxi', content: 'Reliable taxi service in Skopje with mobile app booking and professional drivers.', type: 'service' },
        { title: 'Naxi', content: 'Popular ride-hailing service similar to Uber, available in Skopje with competitive prices.', type: 'service' },
        { title: 'Taxi Services', content: 'Multiple transportation options for getting around Skopje during your stay.', type: 'service' }
      ],
      'instructions': [
        { title: 'Check-in Instructions', content: 'How to access your apartment, get keys, and start your stay at Lynx Apartment.', type: 'guide' },
        { title: 'Apartment Amenities', content: 'Guide to using WiFi, appliances, heating, and other apartment features.', type: 'guide' },
        { title: 'Emergency Information', content: 'Important contacts and procedures for emergencies during your stay.', type: 'info' }
      ],
      'wellness-spa': [
        { title: 'Spa Access', content: 'Information about accessing spa and wellness facilities at Cevahir Sky City.', type: 'service' },
        { title: 'Wellness Facilities', content: 'Available wellness amenities including fitness, relaxation, and spa services.', type: 'service' }
      ],
      'guidebooks': [
        { title: 'Local Attractions', content: 'Discover must-see places, museums, and landmarks near your apartment in Skopje.', type: 'guide' },
        { title: 'Restaurants', content: 'Recommended dining options, local cuisine, and popular restaurants in the area.', type: 'guide' },
        { title: 'Shopping', content: 'Shopping centers, local markets, and stores near Cevahir Sky City.', type: 'guide' },
        { title: 'Transportation', content: 'Public transport, walking directions, and getting around Skopje easily.', type: 'guide' }
      ],
      'check-out': [
        { title: 'Checkout Procedure', content: 'Step-by-step instructions for departing your apartment and returning keys.', type: 'guide' },
        { title: 'Key Return', content: 'How and where to return apartment keys when checking out.', type: 'info' },
        { title: 'Final Instructions', content: 'Last-minute checklist before leaving Lynx Apartment.', type: 'guide' }
      ],
      'house-rules': [
        { title: 'Apartment Rules', content: 'Important policies including noise, smoking, and guest regulations.', type: 'rules' },
        { title: 'Building Policies', content: 'Cevahir Sky City building rules and community guidelines.', type: 'rules' },
        { title: 'Safety Guidelines', content: 'Safety procedures and security measures for your protection.', type: 'rules' }
      ]
    };

    const content = contentMap[page.name] || [];
    this.searchData.set(page.name, content.map(item => ({
      ...item,
      page: page.title,
      url: page.url
    })));
  }

  getFollowingContent(element) {
    let content = '';
    let sibling = element.nextElementSibling;
    let wordCount = 0;

    while (sibling && wordCount < 50) {
      if (sibling.tagName.match(/^H[1-6]$/)) break;
      
      const text = sibling.textContent.trim();
      if (text) {
        content += text + ' ';
        wordCount += text.split(' ').length;
      }
      sibling = sibling.nextElementSibling;
    }

    return content.trim().substring(0, 200) + (content.length > 200 ? '...' : '');
  }

  handleSearch(query) {
    const trimmedQuery = query.trim();
    
    if (trimmedQuery.length < 2) {
      this.hideAutocomplete();
      return;
    }

    const results = this.searchContent(trimmedQuery);
    this.displayResults(results, trimmedQuery);
  }

  searchContent(query) {
    const results = [];
    const queryLower = query.toLowerCase();

    this.searchData.forEach((pageContent, pageName) => {
      pageContent.forEach(item => {
        const titleMatch = item.title.toLowerCase().includes(queryLower);
        const contentMatch = item.content.toLowerCase().includes(queryLower);

        if (titleMatch || contentMatch) {
          const relevance = titleMatch ? 10 : 5;
          results.push({
            ...item,
            relevance,
            matchType: titleMatch ? 'title' : 'content'
          });
        }
      });
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 8);
  }

  displayResults(results, query) {
    this.autocompleteList.innerHTML = '';
    
    if (results.length === 0) {
      this.noResultsDiv.style.display = 'block';
      this.showAutocomplete();
      return;
    }

    this.noResultsDiv.style.display = 'none';

    results.forEach((result, index) => {
      const li = document.createElement('li');
      li.className = 'lynx-search-suggestion';
      li.innerHTML = `
        <div class="lynx-search-suggestion-title">${this.highlightText(result.title, query)}</div>
        <div class="lynx-search-suggestion-content">${this.highlightText(result.content, query)}</div>
        <div class="lynx-search-suggestion-page">📄 ${result.page}</div>
      `;
      
      li.addEventListener('click', () => {
        this.navigateToResult(result);
      });

      this.autocompleteList.appendChild(li);
    });

    this.showAutocomplete();
  }

  highlightText(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(255, 224, 102, 0.3); padding: 1px 2px; border-radius: 2px;">$1</mark>');
  }

  navigateToResult(result) {
    if (result.url === `${this.currentPage}.html`) {
      // Same page - try to scroll to relevant section
      this.scrollToContent(result.title);
    } else {
      // Different page - navigate there
      window.location.href = result.url;
    }
    this.clearSearch();
  }

  scrollToContent(title) {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .card-title, .section-title, .section-text');
    for (const element of elements) {
      if (element.textContent.trim().toLowerCase().includes(title.toLowerCase())) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight the found element temporarily
        element.style.outline = '3px solid #ffe066';
        setTimeout(() => {
          element.style.outline = '';
        }, 3000);
        break;
      }
    }
  }

  showAutocomplete() {
    const autocomplete = this.searchContainer.querySelector('.lynx-search-autocomplete');
    if (autocomplete) {
      autocomplete.classList.add('show');
    }
  }

  hideAutocomplete() {
    const autocomplete = this.searchContainer.querySelector('.lynx-search-autocomplete');
    if (autocomplete) {
      autocomplete.classList.remove('show');
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.hideAutocomplete();
      this.searchInput.focus();
    }
  }

  handleKeyNavigation(e) {
    const suggestions = this.autocompleteList.querySelectorAll('.lynx-search-suggestion');
    const highlighted = this.autocompleteList.querySelector('.lynx-search-suggestion.highlighted');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (highlighted) {
          highlighted.classList.remove('highlighted');
          const next = highlighted.nextElementSibling || suggestions[0];
          next.classList.add('highlighted');
        } else if (suggestions.length > 0) {
          suggestions[0].classList.add('highlighted');
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (highlighted) {
          highlighted.classList.remove('highlighted');
          const prev = highlighted.previousElementSibling || suggestions[suggestions.length - 1];
          prev.classList.add('highlighted');
        } else if (suggestions.length > 0) {
          suggestions[suggestions.length - 1].classList.add('highlighted');
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlighted) {
          highlighted.click();
        }
        break;
        
      case 'Escape':
        this.hideAutocomplete();
        this.searchInput.blur();
        break;
    }
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure other scripts have loaded
  setTimeout(() => {
    window.lynxSearch = new LynxSearch();
  }, 100);
});