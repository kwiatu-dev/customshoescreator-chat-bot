import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
  faCommentDots,
  faRotateRight,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

//import {} from '@fortawesome/free-regular-svg-icons'

library.add(
  faRotateRight,
  faCommentDots,
  faXmark
)

export const setupFontawesome = (app) => {
    app.component('font-awesome-icon', FontAwesomeIcon)

    return app
}