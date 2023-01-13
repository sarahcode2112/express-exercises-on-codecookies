// add new user to the user database (with passport, not jwt). Because this can be done through the UI now, this code is not as useful anymore:

import UserDetails from './models/user.js'

UserDetails.register({ username: 'candy', active: false }, 'cane')
UserDetails.register({ username: 'starbuck', active: false }, 'redeye')