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

const hookUserAdmin = async () => {
    const listEl = document.getElementById('user-list');
    if (!listEl) return;
    const messageEl = document.getElementById('user-message');
    const cardTemplate = document.getElementById('user-card-template');
    const editTemplate = document.getElementById('user-edit-template');
    let usersById = new Map();

    const renderUsers = () => {
        const fragment = document.createDocumentFragment();
        usersById.forEach((user) => {
            const card = cardTemplate.content.cloneNode(true);
            const element = card.querySelector('[data-user-id]');
            element.dataset.userId = user.id;
            card.querySelector('.user-name').textContent = user.displayName;
            card.querySelector('.user-username').textContent = `Username: ${user.username}`;
            card.querySelector('.user-email').textContent = `Email: ${user.email}`;
            card.querySelector('.user-role').textContent = `Role: ${user.role}`;
            fragment.append(card);
        });
        listEl.replaceChildren(fragment);
    };

    const loadUsers = async () => {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Unable to load users.');
        const { users } = await response.json();
        usersById = new Map(users.map((user) => [user.id, user]));
        renderUsers();
    };

    listEl.addEventListener('click', async (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button) return;
        const card = button.closest('[data-user-id]');
        const user = usersById.get(card.dataset.userId);
        if (button.dataset.action === 'cancel') {
            renderUsers();
        } else if (button.dataset.action === 'edit') {
            const editor = editTemplate.content.cloneNode(true);
            const form = editor.querySelector('form');
            form.dataset.userId = user.id;
            form.elements.displayName.value = user.displayName;
            form.elements.username.value = user.username;
            form.elements.email.value = user.email;
            form.addEventListener('submit', async (submitEvent) => {
                submitEvent.preventDefault();
                const body = Object.fromEntries(new FormData(form));
                const saveResponse = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!saveResponse.ok) {
                    messageEl.textContent = 'Unable to update user.';
                    return;
                }
                const payload = await saveResponse.json();
                usersById.set(payload.user.id, payload.user);
                renderUsers();
                messageEl.textContent = 'User updated.';
            });
            card.replaceWith(editor);
        } else if (button.dataset.action === 'delete') {
            if (!window.confirm(`Delete ${user.displayName}?`)) return;
            const deleteResponse = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
                method: 'DELETE'
            });
            if (!deleteResponse.ok) {
                messageEl.textContent = 'Unable to delete user.';
                return;
            }
            usersById.delete(user.id);
            renderUsers();
            messageEl.textContent = 'User deleted.';
        }
    });

    try {
        await loadUsers();
    } catch (error) {
        messageEl.textContent = error.message;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookUserAdmin();
});