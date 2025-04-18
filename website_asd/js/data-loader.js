/**
 * Data Loader
 * Loads site data from JSON file and updates page content based on language
 */
class DataLoader {
    constructor() {
        this.data = null;
        this.lang = localStorage.getItem('language') || 'en';
        
        // Listen for language change events
        window.addEventListener('languageChanged', (e) => {
            this.setLanguage(e.detail.language);
        });
    }
    
    /**
     * Load data from the JSON file
     */
    async loadData() {
        try {
            // Fetch the data from the JSON file
            const response = await fetch('data/website.json');
            if (!response.ok) {
                throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
            }
            
            this.data = await response.json();
            
            // Update the page content with the loaded data
            this.updatePageContent();
            
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            
            // If there's an error loading the data, show error message
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="error-message">
                        <h2>Error Loading Data</h2>
                        <p>Sorry, there was an error loading the website data. Please try again later.</p>
                        <button onclick="window.location.reload()">Reload</button>
                    </div>
                `;
            }
        }
    }
    
    /**
     * Set the current language
     */
    setLanguage(lang) {
        this.lang = lang;
        this.updatePageContent();
    }
    
    /**
     * Update page content based on the current language
     */
    updatePageContent() {
        if (!this.data) return;
        
        // Helper functions for setting text and attributes
        const setText = (selector, text) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.textContent = text;
            });
        };
        
        const setAttr = (selector, attribute, value) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) el.setAttribute(attribute, value);
            });
        };
        
        const updateDataAttrs = (attributeBase) => {
            const elements = document.querySelectorAll(`[${attributeBase}]`);
            elements.forEach(el => {
                const key = el.getAttribute(attributeBase);
                const langAttr = `${attributeBase}-${this.lang}`;
                if (el.hasAttribute(langAttr)) {
                    el.textContent = el.getAttribute(langAttr);
                }
            });
        };
        
        // Update elements with data-en, data-fr attributes
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(`data-${this.lang}`) || el.getAttribute('data-en');
        });
        
        // Update hero section
        if (this.data.siteInfo) {
            const tagline = this.data.siteInfo.tagline[this.lang] || this.data.siteInfo.tagline.en;
            setText('[data-hero="title"]', this.data.siteInfo.name);
            setText('[data-hero="subtitle"]', tagline);
        }
        
        // Update about section
        if (this.data.about) {
            const description = this.data.about.description[this.lang] || this.data.about.description.en;
            setText('[data-about="description"]', description);
            
            const mission = this.data.about.mission[this.lang] || this.data.about.mission.en;
            setText('[data-mission="title"]', 'Our Mission');
            setText('[data-mission="description"]', mission);
        }
        
        // Update statistics
        if (this.data.siteInfo && this.data.siteInfo.stats) {
            const stats = this.data.siteInfo.stats;
            setText('[data-stat="editions"]', stats.editions);
            setText('[data-stat="participants"]', stats.debaters);
            setText('[data-stat="countries"]', stats.cities);
            setText('[data-stat="events"]', stats.champions);
        }
        
        // Update cofounders section if exists
        if (document.getElementById('cofounders') && this.data.team && this.data.team.board) {
            const board = this.data.team.board;
            if (board.length >= 2) {
                setText('[data-cofounder1="name"]', board[0].name);
                setText('[data-cofounder2="name"]', board[1].name);
                
                const bio1 = board[0].bio[this.lang] || board[0].bio.en;
                const bio2 = board[1].bio[this.lang] || board[1].bio.en;
                setText('[data-cofounder1="message"]', bio1);
                setText('[data-cofounder2="message"]', bio2);
            }
        }
        
        // Update trusted by logos if exists
        if (document.getElementById('trustedLogos') && this.data.partners && this.data.partners.sponsors) {
            const logosContainer = document.getElementById('trustedLogos');
            logosContainer.innerHTML = '';
            
            this.data.partners.sponsors.forEach(sponsor => {
                const logoDiv = document.createElement('div');
                logoDiv.className = 'partner-logo';
                logoDiv.innerHTML = `
                    <img src="${sponsor.logo}" alt="${sponsor.name}">
                `;
                logosContainer.appendChild(logoDiv);
            });
        }
        
        // Update previous editions section if exists
        if (document.getElementById('previousEditionsGrid') && this.data.media && this.data.media.videos) {
            const editionsGrid = document.getElementById('previousEditionsGrid');
            editionsGrid.innerHTML = '';
            
            this.data.media.videos.forEach(video => {
                const title = video.title[this.lang] || video.title.en;
                const editionCard = document.createElement('div');
                editionCard.className = 'edition-card';
                editionCard.innerHTML = `
                    <img src="${video.thumbnail}" alt="${title}">
                    <h3>${title}</h3>
                    <a href="${video.url}" class="youtube-link" target="_blank">
                        <i class="fab fa-youtube"></i> 
                        <span data-en="Watch Replay" data-fr="Regarder">${this.lang === 'fr' ? 'Regarder' : 'Watch Replay'}</span>
                    </a>
                `;
                editionsGrid.appendChild(editionCard);
            });
        }
        
        // Update community section if exists
        if (document.getElementById('communityCards') && this.data.community && this.data.community.benefits) {
            const communityCards = document.getElementById('communityCards');
            communityCards.innerHTML = '';
            
            this.data.community.benefits.forEach(benefit => {
                const title = benefit.title[this.lang] || benefit.title.en;
                const description = benefit.description[this.lang] || benefit.description.en;
                
                const card = document.createElement('div');
                card.className = 'community-card';
                card.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description}</p>
                `;
                communityCards.appendChild(card);
            });
        }
        
        // Update footer contact information
        if (this.data.contact) {
            setText('.footer-section p:nth-child(2)', `Email: ${this.data.contact.info.email.value}`);
            setText('.footer-section p:nth-child(3)', `Phone: ${this.data.contact.info.phone.value}`);
            
            // Update social links
            if (this.data.contact.social) {
                const socialLinks = document.querySelectorAll('.social-link');
                socialLinks.forEach(link => {
                    const platform = link.textContent.toLowerCase();
                    if (this.data.contact.social[platform]) {
                        link.href = this.data.contact.social[platform];
                    }
                });
            }
        }

        this.updateFooterContact();
        
        // Check if we're on the contact page and update it if needed
        if (document.querySelector('.contact-main')) {
            this.updateContactPageContent();
        }
    }

    updateFooterContact() {
        if (!this.data || !this.data.contact) return;
        
        // Update footer contact information
        this.setText('.footer-contact-email', this.data.contact.info?.email?.value || '');
        this.setText('.footer-contact-phone', this.data.contact.info?.phone?.value || '');
    }

    /**
     * Update contact page content with translations
     */
    updateContactPageContent() {
        if (!this.data || !this.data.contact) return;
        
        const contact = this.data.contact;
        const lang = this.lang;
        
        // Update page title and subtitle
        this.setText('[data-lang-key="contact_title"]', contact.title[lang] || contact.title.en);
        this.setText('[data-lang-key="contact_subtitle"]', contact.subtitle[lang] || contact.subtitle.en);
        
        // Update form section
        this.setText('[data-lang-key="contact_form_title"]', contact.form.title[lang] || contact.form.title.en);
        
        // Update form fields
        this.setText('[data-lang-key="contact_name"]', contact.form.fields.name[lang] || contact.form.fields.name.en);
        this.setText('[data-lang-key="contact_email"]', contact.form.fields.email[lang] || contact.form.fields.email.en);
        this.setText('[data-lang-key="contact_subject"]', contact.form.fields.subject[lang] || contact.form.fields.subject.en);
        this.setText('[data-lang-key="contact_message"]', contact.form.fields.message[lang] || contact.form.fields.message.en);
        
        // Update error messages
        this.setText('[data-lang-key="contact_name_error"]', 'Please enter your name');
        this.setText('[data-lang-key="contact_email_error"]', 'Please enter a valid email');
        this.setText('[data-lang-key="contact_subject_error"]', 'Please enter a subject');
        this.setText('[data-lang-key="contact_message_error"]', 'Please enter your message');
        
        // Update submit button
        this.setText('[data-lang-key="contact_submit"]', contact.form.fields.submit[lang] || contact.form.fields.submit.en);
        
        // Update contact info section
        this.setText('[data-lang-key="contact_info_title"]', contact.info.title[lang] || contact.info.title.en);
        
        // Update contact details
        this.setText('[data-lang-key="contact_address_title"]', contact.info.address.label[lang] || contact.info.address.label.en);
        this.setText('[data-lang-key="contact_address"]', contact.info.address.value);
        this.setText('[data-lang-key="contact_phone_title"]', contact.info.phone.label[lang] || contact.info.phone.label.en);
        this.setText('[data-lang-key="contact_email_title"]', contact.info.email.label[lang] || contact.info.email.label.en);
        this.setText('[data-lang-key="contact_hours_title"]', contact.info.hours.label[lang] || contact.info.hours.label.en);
        this.setText('[data-lang-key="contact_hours"]', contact.info.hours.value[lang] || contact.info.hours.value.en);
        
        // Update social links
        this.setText('[data-lang-key="contact_social_title"]', 'Follow Us');
        
        // Update FAQ section
        this.setText('[data-lang-key="faq_title"]', contact.faq.title[lang] || contact.faq.title.en);
        
        // Update FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length && contact.faq.items) {
            for (let i = 0; i < Math.min(faqItems.length, contact.faq.items.length); i++) {
                const faqItem = faqItems[i];
                const item = contact.faq.items[i];
                
                this.setText(faqItem.querySelector('[data-lang-key^="faq_q"]'), item.question[lang] || item.question.en);
                this.setText(faqItem.querySelector('[data-lang-key^="faq_a"]'), item.answer[lang] || item.answer.en);
            }
        }
        
        // Update success modal
        this.setText('[data-lang-key="contact_success_title"]', contact.success.title[lang] || contact.success.title.en);
        this.setText('[data-lang-key="contact_success_message"]', contact.success.message[lang] || contact.success.message.en);
        this.setText('[data-lang-key="contact_success_ok"]', contact.success.button[lang] || contact.success.button.en);
    }

    // Helper methods
    setText(selector, text) {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            elements.forEach(element => {
                if (element) element.textContent = text || '';
            });
        }
    }

    setHTML(selector, html) {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            elements.forEach(element => {
                if (element) element.innerHTML = html || '';
            });
        }
    }

    setAttr(selector, attr, value) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (el) el.setAttribute(attr, value);
        });
    }
}

// Create and export the data loader instance
const dataLoader = new DataLoader();

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    dataLoader.loadData();
});

// Export for use in other modules
export { dataLoader }; 