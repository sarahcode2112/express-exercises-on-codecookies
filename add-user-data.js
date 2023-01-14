// add new user to the user database (with passport, not jwt). Because this can be done through the UI now, this code is not as useful anymore:
// thank you to the passport tutorial for teaching me to write this code:

import UserDetails from './models/user.js'

UserDetails.register({ username: 'candy', active: false }, 'cane')
UserDetails.register({ username: 'starbuck', active: false }, 'redeye')