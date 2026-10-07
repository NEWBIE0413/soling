# Solingo design system

## 1. Atmosphere & identity

A bright, tactile learning game, not a dashboard. Preserve Solingo's green square
mascot and give it expressive eyes, soft limbs and an articulated celebration.
Learning progress is the focal point; illustrations reward effort rather than
compete with a question. Duolingo is the quality benchmark, not an asset source.
Apple Design supplies immediate press feedback, spatial continuity, interruptible
controls and reduced-motion alternatives. Build on the existing Tailwind/Radix
components, not a second UI framework.

## 2. Color

| Role          | Token / value                    | Use                                |
| ------------- | -------------------------------- | ---------------------------------- |
| Canvas        | `--background: 0 0% 100%`        | White, light-mode learning surface |
| Ink           | `--foreground: 140 12% 23%`      | Headings and body                  |
| Muted ink     | `--muted-foreground: 135 6% 43%` | Supporting text                    |
| Quiet surface | `--muted: 100 23% 97%`           | Aside and inactive controls        |
| Border        | `--border: 110 13% 88%`          | Neutral structural edges           |
| Leaf          | `--game-green: #58c900`          | Main action, progress, mascot      |
| Leaf depth    | `--game-green-depth: #409309`    | Physical button base               |
| Leaf ink      | `--game-green-ink: #214708`      | Legible text on bright leaf        |
| Leaf wash     | `--game-green-soft: #eff9e5`     | Selected navigation                |
| Sky           | `--game-blue: #1ca7e8`           | Gems and information               |
| Sky wash      | `--game-blue-soft: #eaf7ff`      | Selected answer                    |
| Honey         | `--game-gold: #ffc83d`           | XP, trophies and milestones        |
| Tangerine     | `--game-orange: #ff9633`         | Streak                             |
| Berry         | `--game-red: #df5260`            | Incorrect answer and hearts        |
| Lilac         | `--game-purple: #9061cf`         | Optional writing and achievements  |

SVG art can use highlight/shadow ramps of these hues: green #8ee244/#aceb70,
sky #63d3fa/#087bb8, honey #ffe58d/#dc9416, orange #ffbc70/#d65d18,
berry #ff8f98/#b63448, ink #324238 and white. Existing course flags and profile
skins are preserved. Status always also has a label or glyph. The product
remains light-mode in both system color preferences; adding a dark theme is not
part of this redesign.

## 3. Typography

Retain Nunito for Latin with `ui-rounded`, `Apple SD Gothic Neo`, `Malgun Gothic`
and system sans fallbacks for Korean/Japanese. No new remote font provider.
Body 16px/1.6, supporting text 14px/1.5, navigation 14px/800, captions 12px/700,
section headings 20-24px/800, page headings 28-32px/900, reward heading 32-40px/900.
Use tabular numerals for changing statistics. Body copy uses normal tracking,
headings -0.025em. Korean text keeps words together with an overflow-wrap escape
for long unbroken content. Button copy stays in normal case.

## 4. Spacing & layout

Four-pixel spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
Phone padding 20px; desktop 32px. Main shell max width 1200px.
Below 1024px: safe-area-aware top status bar and bottom navigation.
At 1024px: 224px fixed navigation and a single roomy content column.
At 1280px: add a 280px supporting rail; never squeeze the curriculum to fit it.
Main document owns scrolling. Side navigation is independently scrollable only
when its menu cannot fit. Supporting rail uses sticky-aside layout.
Lessons use a `100dvh` cover/scroll-body-shell: bounded header and footer,
`min-height: 0` scrolling question area, 760px readable question width.
Rewards use the same shell. At 390px and 200% zoom, text wraps without horizontal
overflow. Shared primitives: stack, cluster, content-limiter, sticky-aside.

## 5. Components

### Button (`components/ui/button.tsx`)

- Native button or Radix Slot anchor; 48px minimum normal height, 44px icon/small.
- Filled leaf / sky / berry, quiet outline, ghost, navigation and disabled.
- A stable neutral border and bottom box-shadow form a physical base; pressing
  translates the face 3px and shortens its shadow, without changing box height.
- Pointer hover is capability-gated. Same-frame press, visible focus ring,
  legible disabled state, no animation wait before committing an action.

### BrandIcon (`components/brand-icon.tsx`)

- Reusable 48-unit inline SVG; a rounded colored silhouette, a darker base and
  a restrained highlight. Same art for sidebar, bottom navigation and rewards.
- Names: learn, quests, streak, shop, profile, trophy, gem, xp, heart, practice,
  writing, check, lock, star, course.
- Decorative by default; the surrounding control supplies its accessible name.
- Lucide remains for small universal actions such as close, back and chevrons.

### Mascot (`components/mascot.tsx`)

- Original Solingo green rounded-square character, now with eyes and limbs.
- Poses: idle, wave, celebrate, thinking. Decorative unless given a label.
- Celebration is a finite anticipation/jump/arm-raise/landing sequence. Normal
  completion and perfect completion vary via expression/scene, not huge confetti.
- Reduced motion retains a happy resting pose with a brief fade.

### Choice card / lesson node

- Choice cards are native buttons with aria-pressed and visible 1-9 hints.
- Selection uses a tonal wash and check glyph, no changing layout or colored
  accent border. Correct/incorrect use a glyph and text, not just hue.
- Nodes are one semantic link, not a button nested in a link; locked nodes are
  non-navigable. The current node has a readable lesson title and a start action.
- Newly completed/opened nodes animate once; no endless bouncing.

### PageHeader / Surface

- Shared header: optional colored icon, title and one descriptive sentence.
- Surface: white or muted rounded panel, neutral border, restrained bottom depth.
- Empty states explain the next action; loading uses existing skeleton routes.

### Reward scene

- Articulated mascot anchored over a ground shadow and a small burst of SVG stars.
- XP, accuracy and time follow the scene; continuation is never delayed by art.
- Existing streak, quest-claim and achievement data remains authoritative.
- Completion/save failure is visible and distinct from success.

## 6. Motion & interaction

`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, micro 120ms, standard 220ms.
Controls use retargetable CSS transitions; finite celebration art uses keyframes
on transform/opacity only. One signature celebration lasts about 1100ms; ordinary
navigation never waits for it. Subsequent reward transitions are 180-220ms.
No permanent decorative motion. Audio only follows a learning action and remains
separate from purely visual navigation. Reduced motion removes translation,
rotation and scaling but preserves readable final state and short fades.
No additional animation runtime is necessary for these finite vector scenes.

## 7. Depth & surface

Mixed strategy: quiet neutral borders on panels, solid color lips on controls,
and a soft ground shadow under characters. No dashboard-like glass or ambient
gradient backgrounds. Radius: controls 16px, cards 20px, feature scenes 28px,
round nodes/counters 9999px. Child corners inset by their padding.

## 8. Accessibility constraints & verification

Target WCAG AA contrast, visible keyboard focus, semantic controls, labels on
inputs, 44px targets and reduced motion. Existing numeric/Enter shortcuts must
not act while typing into a field or while a dialog owns focus.
Verify guest root, authenticated root, course selection, learning path, all seven
exercise types, summary/streak/quests/badges, navigation siblings and kana engine
at phone, small laptop and desktop widths. Use an isolated local QA database and
account; never modify existing learners' records for QA. Record browser evidence
and static-check results in `.omo/evidence/`. Mobile browser emulation is not a
claim of physical iOS/Android verification.
