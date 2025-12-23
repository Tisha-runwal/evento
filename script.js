// --- Data & State ---
const MOCK_EVENTS = [
    {
        id: 1,
        title: "Arijit Singh Live Concert",
        date: "2023-12-15",
        time: "19:00",
        location: "Mumbai",
        venue: "DY Patil Stadium",
        category: "Music",
        price: 2500,
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Experience the magical voice of Arijit Singh live in Mumbai. A night of soulful melodies and chart-busting hits. Gates open at 5 PM."
    },
    {
        id: 2,
        title: "India Tech Summit 2023",
        date: "2023-11-20",
        time: "09:00",
        location: "Bengaluru",
        venue: "Bangalore International Exhibition Centre",
        category: "Tech",
        price: 1500,
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Join industry leaders, startups, and investors at India's biggest tech conference. Workshops on AI, Blockchain, and Web3."
    },
    {
        id: 3,
        title: "Great Indian Comedy Festival",
        date: "2023-12-05",
        time: "20:00",
        location: "Delhi",
        venue: "Siri Fort Auditorium",
        category: "Comedy",
        price: 999,
        image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Laugh out loud with India's top comedians under one roof. Featuring Zakir Khan, Vir Das, and more."
    },
    {
        id: 4,
        title: "Sunburn Goa 2023",
        date: "2023-12-28",
        time: "16:00",
        location: "Goa",
        venue: "Vagator Beach",
        category: "Music",
        price: 4000,
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Asia's biggest electronic dance music festival. 3 days of non-stop music, dance, and beach vibes."
    },
    {
        id: 5,
        title: "Photography Masterclass",
        date: "2023-11-25",
        time: "10:00",
        location: "Hyderabad",
        venue: "Ramoji Film City",
        category: "Workshop",
        price: 500,
        image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Learn the art of photography from award-winning photographers. Bring your DSLR. Lunch included."
    },
    {
        id: 6,
        title: "Diwali Food Mela",
        date: "2023-11-10",
        time: "12:00",
        location: "Delhi",
        venue: "Jawaharlal Nehru Stadium",
        category: "Food",
        price: 200,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Taste the flavors of India. Over 100 food stalls, live music, and cooking competitions."
    }
];

const app = {
    state: {
        currentUser: null,
        bookings: [],
        currentView: 'home',
        selectedEvent: null,
        checkoutQty: 1,
        authMode: 'login'
    },

    init: () => {
        const storedUser = localStorage.getItem('evento_user');
        if (storedUser) app.state.currentUser = JSON.parse(storedUser);
        
        const storedBookings = localStorage.getItem('evento_bookings');
        if (storedBookings) app.state.bookings = JSON.parse(storedBookings);

        app.updateAuthUI();
        app.events.render(MOCK_EVENTS);
        
        // Setup Click Listeners (Close modals/menus when clicking outside)
        window.onclick = function(event) {
            const authModal = document.getElementById('auth-modal');
            const ticketModal = document.getElementById('ticket-modal');
            const userDropdown = document.getElementById('user-dropdown');
            const userBtn = document.getElementById('user-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileBtn = document.getElementById('mobile-menu-btn');

            // Close Modals
            if (event.target == authModal) app.closeModal();
            if (event.target == ticketModal) ticketModal.classList.add('hidden');

            // Close User Dropdown if clicking outside
            if (userDropdown && !userDropdown.classList.contains('hidden')) {
                // If the click was NOT on the button AND NOT on the dropdown itself
                if (!userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                    userDropdown.classList.add('hidden');
                }
            }
        }

        app.router('home');
    },

    toggleUserMenu: () => {
        const menu = document.getElementById('user-dropdown');
        menu.classList.toggle('hidden');
    },

    toggleMobileMenu: () => {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    },

    router: (viewId, data = null) => {
        // Hide mobile menu & dropdowns on navigation
        document.getElementById('mobile-menu').classList.add('hidden');
        document.getElementById('user-dropdown').classList.add('hidden');
        
        document.querySelectorAll('section[id^="view-"]').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.classList.remove('hidden');
        
        app.state.currentView = viewId;
        window.scrollTo(0, 0);

        if(viewId === 'details' && data) app.events.renderDetail(data);
        if(viewId === 'dashboard') app.dashboard.render();
        if(viewId === 'checkout') app.booking.initCheckout();
        if(viewId === 'home') app.events.render(MOCK_EVENTS);
    },

    openModal: (type) => {
        const modal = document.getElementById('auth-modal');
        const title = document.getElementById('auth-title');
        const nameField = document.getElementById('name-field');
        const switchText = document.getElementById('auth-switch-text');
        const switchBtn = document.getElementById('auth-switch-btn');
        
        // Close other menus
        document.getElementById('mobile-menu').classList.add('hidden');

        modal.classList.remove('hidden');
        app.state.authMode = type;

        if(type === 'register') {
            title.textContent = 'Create Account';
            nameField.classList.remove('hidden');
            document.getElementById('input-name').required = true;
            switchText.textContent = 'Already have an account?';
            switchBtn.textContent = 'Login';
        } else {
            title.textContent = 'Login to Evento';
            nameField.classList.add('hidden');
            document.getElementById('input-name').required = false;
            switchText.textContent = "Don't have an account?";
            switchBtn.textContent = 'Sign Up';
        }
    },

    closeModal: () => {
        document.getElementById('auth-modal').classList.add('hidden');
    },

    toast: (msg, type = 'success') => {
        const el = document.getElementById('toast');
        const icon = document.getElementById('toast-icon');
        const txt = document.getElementById('toast-message');
        
        txt.textContent = msg;
        icon.className = type === 'success' 
            ? 'fa-solid fa-check-circle text-green-400 mr-3' 
            : 'fa-solid fa-exclamation-circle text-red-400 mr-3';
        
        el.classList.remove('translate-y-20');
        setTimeout(() => el.classList.add('translate-y-20'), 3000);
    },

    auth: {
        toggleMode: () => {
            app.openModal(app.state.authMode === 'login' ? 'register' : 'login');
        },

        submit: (e) => {
            e.preventDefault();
            const email = document.getElementById('input-email').value;
            const password = document.getElementById('input-password').value;
            const name = document.getElementById('input-name').value;

            setTimeout(() => {
                if(app.state.authMode === 'register') {
                    const user = { id: Date.now(), name, email };
                    localStorage.setItem('evento_user', JSON.stringify(user));
                    app.state.currentUser = user;
                    app.toast('Account created successfully!');
                } else {
                    const user = { id: 123, name: 'Demo User', email };
                    localStorage.setItem('evento_user', JSON.stringify(user));
                    app.state.currentUser = user;
                    app.toast('Logged in successfully!');
                }
                app.closeModal();
                app.updateAuthUI();
                if(app.state.currentView === 'details') app.router('details', app.state.selectedEvent.id);
            }, 800);
        },

        logout: () => {
            localStorage.removeItem('evento_user');
            app.state.currentUser = null;
            app.updateAuthUI();
            
            // Close any open menus
            document.getElementById('mobile-menu').classList.add('hidden');
            document.getElementById('user-dropdown').classList.add('hidden');
            
            app.router('home');
            app.toast('Logged out');
        }
    },

    updateAuthUI: () => {
        const btns = document.getElementById('auth-buttons');
        const menu = document.getElementById('user-menu-container'); // Changed ID to container
        
        // Mobile elements
        const mobileAuth = document.getElementById('mobile-auth-buttons');
        const mobileLogout = document.getElementById('mobile-logout-btn');

        if(app.state.currentUser) {
            // Desktop
            btns.classList.add('hidden');
            menu.classList.remove('hidden');
            document.getElementById('user-name').textContent = app.state.currentUser.name.split(' ')[0];
            
            // Mobile
            if(mobileAuth) mobileAuth.classList.add('hidden');
            if(mobileLogout) mobileLogout.classList.remove('hidden');
        } else {
            // Desktop
            btns.classList.remove('hidden');
            menu.classList.add('hidden');
            
            // Mobile
            if(mobileAuth) mobileAuth.classList.remove('hidden');
            if(mobileLogout) mobileLogout.classList.add('hidden');
        }
    },

    events: {
        render: (events) => {
            const grid = document.getElementById('events-grid');
            const noData = document.getElementById('no-events');
            grid.innerHTML = '';

            if(events.length === 0) {
                noData.classList.remove('hidden');
                return;
            }
            noData.classList.add('hidden');

            events.forEach(evt => {
                const card = document.createElement('div');
                card.className = 'bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 group';
                card.innerHTML = `
                    <div class="relative h-48 overflow-hidden">
                        <img src="${evt.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="${evt.title}">
                        <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                            ${evt.category}
                        </div>
                        <div class="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold">
                            ₹${evt.price}
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wide">${new Date(evt.date).toDateString()} • ${evt.location}</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2 leading-tight truncate">${evt.title}</h3>
                        <p class="text-gray-500 text-sm mb-4 line-clamp-2">${evt.description}</p>
                        <button onclick="app.router('details', ${evt.id})" class="w-full border border-primary text-primary hover:bg-primary hover:text-white font-medium py-2 rounded-lg transition">View Details</button>
                    </div>
                `;
                grid.appendChild(card);
            });
        },

        renderDetail: (id) => {
            const evt = MOCK_EVENTS.find(e => e.id == id);
            app.state.selectedEvent = evt;

            document.getElementById('detail-image').src = evt.image;
            document.getElementById('detail-title').textContent = evt.title;
            document.getElementById('detail-category').textContent = evt.category;
            document.getElementById('detail-date').textContent = new Date(evt.date).toDateString();
            document.getElementById('detail-location').textContent = `${evt.venue}, ${evt.location}`;
            document.getElementById('detail-time').textContent = evt.time;
            document.getElementById('detail-description').textContent = evt.description;
            document.getElementById('detail-price').textContent = '₹' + evt.price;

            const area = document.getElementById('booking-action-area');
            if(app.state.currentUser) {
                area.innerHTML = `
                    <button onclick="app.router('checkout')" class="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-secondary hover:scale-[1.02] transition transform">
                        Book Tickets Now
                    </button>
                    <p class="text-center text-xs text-gray-500 mt-2">Instant confirmation via Email</p>
                `;
            } else {
                area.innerHTML = `
                    <div class="bg-orange-50 border border-orange-200 p-4 rounded-lg text-center">
                        <p class="text-orange-800 text-sm mb-3">Please login to book tickets.</p>
                        <button onclick="app.openModal('login')" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium w-full">Login</button>
                    </div>
                `;
            }
        },

        filter: () => {
            const search = document.getElementById('search-input').value.toLowerCase();
            const loc = document.getElementById('filter-location').value;
            const cat = document.getElementById('filter-category').value;

            const filtered = MOCK_EVENTS.filter(e => {
                const matchesSearch = e.title.toLowerCase().includes(search) || e.location.toLowerCase().includes(search);
                const matchesLoc = loc === '' || e.location === loc;
                const matchesCat = cat === '' || e.category === cat;
                return matchesSearch && matchesLoc && matchesCat;
            });

            app.events.render(filtered);
        },
        
        sort: (type) => {
            let sorted = [...MOCK_EVENTS];
            if(type === 'price-low') sorted.sort((a,b) => a.price - b.price);
            if(type === 'price-high') sorted.sort((a,b) => b.price - a.price);
            if(type === 'date') sorted.sort((a,b) => new Date(a.date) - new Date(b.date));
            app.events.render(sorted);
        },

        clearFilters: () => {
            document.getElementById('search-input').value = '';
            document.getElementById('filter-location').value = '';
            document.getElementById('filter-category').value = '';
            app.events.render(MOCK_EVENTS);
        }
    },

    booking: {
        initCheckout: () => {
            const evt = app.state.selectedEvent;
            if(!evt) { app.router('home'); return; }
            
            app.state.checkoutQty = 1;
            document.getElementById('checkout-event-name').textContent = evt.title;
            document.getElementById('checkout-event-date').textContent = new Date(evt.date).toDateString();
            document.getElementById('checkout-qty').textContent = '1';
            
            // Reset Payment buttons
            app.booking.selectPayment('upi');
            
            app.booking.updateTotals();
        },

        selectPayment: (method) => {
            const upiBtn = document.getElementById('pay-upi');
            const cardBtn = document.getElementById('pay-card');
            
            const activeClass = "border-2 border-primary bg-primary/5 text-primary";
            const inactiveClass = "border border-gray-200 text-gray-600 hover:border-gray-400";

            if(method === 'upi') {
                upiBtn.className = `flex-1 py-2 rounded-md font-bold text-center ${activeClass}`;
                cardBtn.className = `flex-1 py-2 rounded-md text-center ${inactiveClass}`;
            } else {
                cardBtn.className = `flex-1 py-2 rounded-md font-bold text-center ${activeClass}`;
                upiBtn.className = `flex-1 py-2 rounded-md text-center ${inactiveClass}`;
            }
        },

        updateQty: (change) => {
            let newQty = app.state.checkoutQty + change;
            if(newQty < 1) newQty = 1;
            if(newQty > 10) newQty = 10;
            
            app.state.checkoutQty = newQty;
            document.getElementById('checkout-qty').textContent = newQty;
            app.booking.updateTotals();
        },

        updateTotals: () => {
            const price = app.state.selectedEvent.price;
            const qty = app.state.checkoutQty;
            const sub = price * qty;
            const tax = sub * 0.18;
            const total = sub + tax;

            document.getElementById('bill-subtotal').textContent = '₹' + sub;
            document.getElementById('bill-tax').textContent = '₹' + tax.toFixed(2);
            document.getElementById('bill-total').textContent = '₹' + total.toFixed(2);
        },

        confirmPayment: () => {
            const btn = document.getElementById('btn-pay-now');
            const originalText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

            setTimeout(() => {
                const bookingId = 'EVT-' + Math.floor(Math.random() * 10000000);
                const newBooking = {
                    id: bookingId,
                    eventId: app.state.selectedEvent.id,
                    eventTitle: app.state.selectedEvent.title,
                    eventDate: app.state.selectedEvent.date,
                    eventLocation: app.state.selectedEvent.location,
                    venue: app.state.selectedEvent.venue,
                    qty: app.state.checkoutQty,
                    total: document.getElementById('bill-total').textContent,
                    status: 'Confirmed',
                    bookedOn: new Date().toISOString()
                };

                app.state.bookings.unshift(newBooking);
                localStorage.setItem('evento_bookings', JSON.stringify(app.state.bookings));

                app.toast('Booking Confirmed! Ticket Generated.');
                
                btn.disabled = false;
                btn.innerHTML = originalText;
                
                app.router('dashboard');
            }, 2000);
        }
    },

    dashboard: {
        render: () => {
            const list = document.getElementById('bookings-list');
            list.innerHTML = '';
            
            document.getElementById('dash-total-bookings').textContent = app.state.bookings.length;
            let totalSpent = 0;
            app.state.bookings.forEach(b => {
                if(b.status !== 'Cancelled') {
                    totalSpent += parseFloat(b.total.replace('₹', ''));
                }
            });
            document.getElementById('dash-total-spent').textContent = '₹' + totalSpent.toFixed(2);
            if(app.state.currentUser) {
                document.getElementById('dash-email').textContent = app.state.currentUser.email;
            }

            app.dashboard.switchTab('upcoming');
        },

        switchTab: (tab) => {
            const upcomingBtn = document.getElementById('tab-upcoming');
            const pastBtn = document.getElementById('tab-past');
            const list = document.getElementById('bookings-list');
            list.innerHTML = '';

            const now = new Date();

            let filtered = [];
            if(tab === 'upcoming') {
                upcomingBtn.className = "flex-1 py-3 text-center font-medium text-primary border-b-2 border-primary bg-blue-50";
                pastBtn.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:bg-gray-50";
                filtered = app.state.bookings.filter(b => new Date(b.eventDate) >= now || b.status === 'Confirmed');
            } else {
                pastBtn.className = "flex-1 py-3 text-center font-medium text-primary border-b-2 border-primary bg-blue-50";
                upcomingBtn.className = "flex-1 py-3 text-center font-medium text-gray-500 hover:bg-gray-50";
                filtered = app.state.bookings.filter(b => new Date(b.eventDate) < now && b.status !== 'Confirmed');
            }

            if(filtered.length === 0) {
                list.innerHTML = `<div class="text-center py-8 text-gray-500">No bookings found here.</div>`;
                return;
            }

            filtered.forEach(b => {
                const isCancelled = b.status === 'Cancelled';
                const row = document.createElement('div');
                row.className = `flex flex-col sm:flex-row justify-between items-center p-4 border border-gray-200 rounded-lg ${isCancelled ? 'opacity-60 bg-gray-50' : 'bg-white hover:border-primary'} transition`;
                
                row.innerHTML = `
                    <div class="flex flex-col mb-3 sm:mb-0">
                        <span class="font-bold text-lg text-gray-800">${b.eventTitle}</span>
                        <span class="text-sm text-gray-500">${new Date(b.eventDate).toDateString()} • ${b.venue}</span>
                        <div class="flex items-center mt-1">
                            <span class="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600 mr-2">${b.id}</span>
                            <span class="text-xs font-bold ${isCancelled ? 'text-red-500' : 'text-green-500'}">${b.status}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end space-y-2 w-full sm:w-auto">
                        <span class="font-bold text-gray-900">${b.total}</span>
                        <div class="flex space-x-2 w-full sm:w-auto">
                            ${!isCancelled ? `
                            <button onclick="app.generateTicket('${b.id}')" class="flex-1 sm:flex-none px-3 py-1 bg-primary text-white text-sm rounded hover:bg-secondary">
                                <i class="fa-solid fa-ticket mr-1"></i> Ticket
                            </button>
                            <button onclick="app.cancelBooking('${b.id}')" class="flex-1 sm:flex-none px-3 py-1 border border-red-200 text-red-500 text-sm rounded hover:bg-red-50">
                                Cancel
                            </button>
                            ` : '<span class="text-sm text-red-500">Refund Initiated</span>'}
                        </div>
                    </div>
                `;
                list.appendChild(row);
            });
        }
    },

    cancelBooking: (id) => {
        if(!confirm('Are you sure you want to cancel this booking? Refunds are processed within 5-7 days.')) return;
        
        const idx = app.state.bookings.findIndex(b => b.id === id);
        if(idx > -1) {
            app.state.bookings[idx].status = 'Cancelled';
            localStorage.setItem('evento_bookings', JSON.stringify(app.state.bookings));
            app.toast('Booking cancelled successfully.', 'error');
            app.dashboard.render();
        }
    },

    generateTicket: (bookingId) => {
        const booking = app.state.bookings.find(b => b.id === bookingId);
        // Find the event to get the correct time
        const event = MOCK_EVENTS.find(e => e.id == booking.eventId);
        
        const title = booking.eventTitle;
        const date = new Date(booking.eventDate).toDateString();
        // Fallback for time if event not found in mock data
        const time = event ? event.time : "10:00"; 
        const location = booking.venue + ', ' + booking.eventLocation;

        document.getElementById('tkt-event').textContent = title;
        document.getElementById('tkt-category').textContent = 'Standard Entry'; 
        document.getElementById('tkt-date').textContent = date;
        document.getElementById('tkt-time').textContent = time; 
        document.getElementById('tkt-location').textContent = location;
        document.getElementById('tkt-qty').textContent = booking.qty;
        document.getElementById('tkt-amount').textContent = booking.total;
        document.getElementById('tkt-id').textContent = booking.id;

        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        new QRCode(qrContainer, {
            text: JSON.stringify({ id: booking.id, valid: true }),
            width: 128,
            height: 128
        });

        document.getElementById('ticket-modal').classList.remove('hidden');
    },

    verifyTicket: () => {
        const input = document.getElementById('verify-input').value.trim().toUpperCase();
        const res = document.getElementById('verify-result');
        
        if(!input) return;

        res.classList.remove('hidden');
        res.innerHTML = `<div class="text-center"><i class="fa-solid fa-circle-notch fa-spin text-primary"></i> Scanning database...</div>`;

        setTimeout(() => {
            const exists = app.state.bookings.find(b => b.id === input && b.status === 'Confirmed');
            
            if(exists) {
                res.className = "mt-4 p-4 rounded-lg bg-green-100 border border-green-300 text-green-800";
                res.innerHTML = `
                    <div class="flex items-center">
                        <i class="fa-solid fa-check-circle text-2xl mr-3"></i>
                        <div>
                            <div class="font-bold text-lg">Valid Ticket</div>
                            <div class="text-sm">${exists.eventTitle} • ${exists.qty} Pax</div>
                        </div>
                    </div>
                `;
            } else {
                res.className = "mt-4 p-4 rounded-lg bg-red-100 border border-red-300 text-red-800";
                res.innerHTML = `
                    <div class="flex items-center">
                        <i class="fa-solid fa-times-circle text-2xl mr-3"></i>
                        <div>
                            <div class="font-bold text-lg">Invalid Ticket</div>
                            <div class="text-sm">ID not found or cancelled.</div>
                        </div>
                    </div>
                `;
            }
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', app.init);