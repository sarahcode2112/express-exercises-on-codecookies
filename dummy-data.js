// allows you to add in users to the user database:

import UserDetails from './user.js'

UserDetails.register({ username: 'candy', active: false }, 'cane')
UserDetails.register({ username: 'starbuck', active: false }, 'redeye')