const user = [];

// Join User to chat

function userJoin(id, username, room) {
    const user = { id, username, room }

    user.push(user);
    return user;
}

// Get the current user

function getCurrentUser(id) {
    return user.find(user => user.id === id);
}