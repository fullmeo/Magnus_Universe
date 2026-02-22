// legacy.js - Callback-based legacy code (edge: mixed with modern)

function legacyDbQuery(query, callback) {
  setTimeout(() => {
    if (query === 'select user') {
      callback(null, { username: 'test' });
    } else {
      callback(new Error('DB error'), null);
    }
  }, 200);
}

function legacyAuth(username, password, finalCallback) {
  legacyDbQuery(`select user where name='${username}'`, (err, user) => {
    if (err) return finalCallback(err);
    if (user) {
      legacyDbQuery(`check pass='${password}'`, (err2, valid) => {
        if (err2) return finalCallback(err2);
        finalCallback(null, valid ? 'authenticated' : 'failed');
      });
    } else {
      finalCallback(new Error('User not found'));
    }
  });
}

module.exports = { legacyAuth };
