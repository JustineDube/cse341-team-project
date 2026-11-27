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

const hookTripAdmin = async () => {
    const listEl = document.getElementById('trip-list');
    if (!listEl) return;
    const messageEl = document.getElementById('trip-message');
    const cardTemplate = document.getElementById('trip-card-template');
    const editTemplate = document.getElementById('trip-edit-template');
    let tripsById = new Map();
    let stationOptions = [];

    const renderTrips = () => {
        const fragment = document.createDocumentFragment();
        tripsById.forEach((trip) => {
            const card = cardTemplate.content.cloneNode(true);
            const element = card.querySelector('[data-trip-id]');
            element.dataset.tripId = trip.id;
            card.querySelector('.trip-name').textContent = trip.name;
            card.querySelector('.trip-region').textContent = `Region: ${trip.region}`;
            card.querySelector('.trip-distance').textContent = `Distance: ${trip.distance} km`;
            fragment.append(card);
        });
        listEl.replaceChildren(fragment);
    };

    try {
        const [tripsResponse, optionsResponse] = await Promise.all([
            fetch('/api/admin/trips'),
            fetch('/api/admin/trips/options')
        ]);
        if (!tripsResponse.ok || !optionsResponse.ok) {
            throw new Error('Unable to load trip administration data.');
        }
        const [{ trips }, { stations }] = await Promise.all([
            tripsResponse.json(),
            optionsResponse.json()
        ]);
        stationOptions = stations;
        tripsById = new Map(trips.map((trip) => [trip.id, trip]));
        renderTrips();

        listEl.addEventListener('click', async (event) => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;
            const card = button.closest('[data-trip-id]');
            const trip = tripsById.get(card.dataset.tripId);
            if (button.dataset.action === 'cancel') {
                renderTrips();
            } else if (button.dataset.action === 'edit') {
                const editor = editTemplate.content.cloneNode(true);
                const form = editor.querySelector('form');
                form.dataset.tripId = trip.id;
                form.elements.name.value = trip.name;
                form.elements.region.value = trip.region;
                form.elements.distance.value = trip.distance;
                for (const fieldName of ['startStation', 'endStation']) {
                    const select = form.elements[fieldName];
                    stationOptions.forEach((station) => {
                        const option = document.createElement('option');
                        option.value = station.id;
                        option.textContent = station.name || station.id;
                        select.append(option);
                    });
                    select.value = trip[fieldName];
                }
                form.addEventListener('submit', async (submitEvent) => {
                    submitEvent.preventDefault();
                    const body = Object.fromEntries(new FormData(form));
                    const response = await fetch(`/api/admin/trips/${encodeURIComponent(trip.id)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    if (!response.ok) {
                        messageEl.textContent = 'Unable to update trip.';
                        return;
                    }
                    const payload = await response.json();
                    tripsById.set(payload.trip.id, payload.trip);
                    renderTrips();
                    messageEl.textContent = 'Trip updated.';
                });
                card.replaceWith(editor);
            } else if (button.dataset.action === 'delete') {
                if (!window.confirm(`Delete ${trip.name}?`)) return;
                const response = await fetch(`/api/admin/trips/${encodeURIComponent(trip.id)}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    messageEl.textContent = 'Unable to delete trip.';
                    return;
                }
                tripsById.delete(trip.id);
                renderTrips();
                messageEl.textContent = 'Trip deleted.';
            }
        });
    } catch (error) {
        messageEl.textContent = error.message;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookTripAdmin();
});