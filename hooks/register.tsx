import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// Le Petit Orchestre: blush pink by day, chocolate bandstand by night.
const { theme, problems } = makeColors({
  label: 'Le Petit Orchestre',
  roles: {
    accent: '#8FB8C9', // powder blue: links, cursor, focus
    success: '#7FBF98', // mint
    warning: '#D9A441', // mustard
    danger: '#C8574D', // tomato red
    pro: '#9A7DB4', // lilac
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#F6D6D2', // blush page
        'surface-1': '#FBF3E4', // cream cards
        'surface-2': '#FDF8EF', // cream panels
        'surface-3': '#FDF8EF',
        'text-primary': '#3B2A24', // deep chocolate
        'text-secondary': '#5A4238',
        'text-muted': '#6E5348', // #7A5E52, nudged one step for 4.5:1 on blush
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#2A1E1A',
        'surface-1': '#33251F',
        'surface-2': '#3B2B24',
        'surface-3': '#40302A',
        'text-primary': '#FBF3E4',
        'text-secondary': '#EAD8CB',
        'text-muted': '#C4AA9C',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  // cream ticket-paper panels, thin and lightly frosted so the band shows through
  backdrop: { scene: 'le-petit-orchestre', glass: { blur: 4, opacity: 0.6 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== 'le-petit-orchestre') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="A symmetrical striped awning above neat rows of little music notes bobbing in time"
        isInteractive
      />
    )
  })
}
