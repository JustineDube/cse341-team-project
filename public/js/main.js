const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

const hookBookingAdmin = async () => {
    const listEl = document.getElementById('booking-list');
    if (!listEl) return;
    const messageEl = document.getElementById('booking-message');
    const template = document.getElementById('booking-card-template');
    try {
        const response = await fetch('/api/admin/bookings');
        if (!response.ok) throw new Error('Unable to load bookings.');
        const { bookings } = await response.json();
        const fragment = document.createDocumentFragment();
        bookings.forEach((booking) => {
            const card = template.content.cloneNode(true);
            const element = card.querySelector('[data-booking-id]');
            element.dataset.bookingId = booking.id;
            card.querySelector('.booking-id').textContent = `Booking ${booking.id}`;
            card.querySelector('.booking-email').textContent =
                `Passenger: ${booking.passengerEmail || booking.passengers?.[0]?.email || 'Not provided'}`;
            card.querySelector('.booking-status').textContent = `Status: ${booking.status || 'confirmed'}`;
            fragment.append(card);
        });
        listEl.replaceChildren(fragment);

        listEl.onclick = async (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;
            const card = button.closest('[data-booking-id]');
            const id = card.dataset.bookingId;
            if (button.dataset.action === 'delete') {
                if (!window.confirm(`Delete booking ${id}?`)) return;
                const result = await fetch(`/api/bookings/${encodeURIComponent(id)}`, { method: 'DELETE' });
                if (!result.ok) {
                    messageEl.textContent = 'Unable to delete booking.';
                    return;
                }
                card.remove();
                messageEl.textContent = 'Booking deleted.';
            } else if (button.dataset.action === 'edit-status') {
                const status = window.prompt('Status (confirmed or cancelled):', 'confirmed');
                if (!status) return;
                const result = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                if (!result.ok) {
                    messageEl.textContent = 'Unable to update booking.';
                    return;
                }
                const payload = await result.json();
                card.querySelector('.booking-status').textContent = `Status: ${payload.booking.status}`;
                messageEl.textContent = 'Booking updated.';
            }
        };
    } catch (error) {
        messageEl.textContent = error.message;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookBookingAdmin();
});