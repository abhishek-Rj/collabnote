---
name: collabnote-design
description: >
    Design and implement the CollabNote web application's UI using the supplied
    visual reference as the primary art direction. Use this skill whenever
    creating, redesigning, styling, polishing, or reviewing CollabNote's landing
    page, editor/working page, navigation, collaboration UI, document UI, or
    responsive layouts. The desired aesthetic is monochrome, editorial,
    asymmetric, geometric, brutalist-inspired, pixel-structured, spacious,
    typography-driven, and experimental rather than generic SaaS.
---

# CollabNote Design System

## 1. Core objective

CollabNote is a collaborative writing application.

The application must feel like one coherent designed product from the moment the
user lands on the website until they are inside a document editing it with other
people.

The supplied reference image is the primary visual inspiration.

Do NOT copy the reference literally.

Instead, extract its visual language and translate it into a collaborative
document application.

The reference should influence:

- composition
- typography
- spacing
- geometry
- color
- visual hierarchy
- asymmetry
- use of negative space
- small technical annotations
- relationship between large black forms and light backgrounds

It should NOT dictate:

- exact text
- exact logo
- exact shapes
- exact page structure
- exact navigation
- unrelated agency/service content

CollabNote must still look like a useful collaborative writing application.

---

# 2. Reference image

The visual reference is located at:

`assets/collabnote-reference.png`

Always inspect this image before making significant visual decisions.

Treat it as an art-direction reference.

The most important characteristics to extract from it are:

- extremely restrained palette
- large off-white/light-gray canvas
- huge near-black geometric regions
- asymmetric layouts
- generous negative space
- editorial typography
- tiny numerical/technical annotations
- hard geometric edges
- irregular stepped shapes
- minimal navigation
- strong visual hierarchy
- experimental composition without becoming unusable

---

# 3. Overall visual personality

CollabNote should feel:

- experimental
- intelligent
- technical
- editorial
- minimal
- architectural
- slightly strange
- confident
- intentional

It should NOT feel like:

- a generic startup landing page
- a Notion clone
- a Linear clone
- an AI SaaS template
- a dashboard template
- a colorful productivity app
- a glassmorphism website
- a typical Tailwind component collection

Avoid design patterns such as:

- excessive rounded cards
- excessive pills
- huge collections of buttons
- gradient backgrounds
- purple/blue SaaS gradients
- floating glass panels
- excessive drop shadows
- repetitive 3-column cards
- stock illustrations
- unnecessary icons everywhere
- excessive border radius
- excessive animation

The design should look deliberately art-directed.

---

# 4. Color system

Use a very restrained monochrome palette.

Primary background:

`#E8E8E8`

Primary black:

`#171717`

Secondary gray:

`#858585`

Light structural gray:

`#C8C8C8`

White:

`#F5F5F5`

Optional interaction accent:

A restrained electric/cobalt blue.

The blue accent should be used sparingly.

Good uses:

- collaborator cursor
- active collaborator
- text selection
- focused editor state
- synchronization state
- important interactive state

Bad uses:

- blue backgrounds everywhere
- blue buttons everywhere
- blue gradients
- blue cards
- blue decorative shapes

The application should still look almost completely monochrome if the accent
color is removed.

---

# 5. Typography

Typography is one of the primary design elements.

Prefer a modern grotesk / neo-grotesk / geometric sans-serif.

The typography should be:

- clean
- modern
- slightly editorial
- highly readable
- confident
- spacious

Use large typography for major statements.

Use small typography for:

- document metadata
- synchronization information
- collaborator information
- timestamps
- document version
- technical annotations

Avoid excessive font weights.

Avoid making everything bold.

Large headlines should feel like editorial typography rather than marketing
copy pasted into a SaaS template.

---

# 6. Composition

Asymmetry is fundamental.

Do not automatically center everything.

Use:

- large empty areas
- elements positioned away from the center
- oversized typography
- large geometric regions
- visual tension between empty and occupied areas
- irregular edges
- unexpected but intentional alignment

The page should feel composed rather than generated from a component grid.

However:

ASYMMETRY MUST NEVER REDUCE USABILITY.

If an unusual layout makes navigation, reading, editing, or interaction harder,
prioritize usability.

---

# 7. Geometric language

The reference uses large black irregular/pixel-like forms.

Translate that language into CollabNote.

Useful techniques include:

- CSS blocks
- pseudo-elements
- CSS clip-path
- SVG
- stepped rectangles
- pixel-like cutouts
- irregular polygons
- large black surfaces
- hard-edged geometry
- small square elements

The geometry should feel constructed from blocks.

It should NOT look like an 8-bit video game.

Think:

"contemporary editorial design using pixel geometry"

not:

"retro arcade website."

Large black forms can act as:

- structural framing
- hero artwork
- section boundaries
- editor framing
- visual transitions
- background compositions

Do not place huge black shapes behind every piece of content.

---

# 8. Technical annotation motif

The reference contains tiny numbers around its large geometric forms.

This is an important visual motif.

Translate it into CollabNote using meaningful technical metadata.

Examples:

`v1.4.2`

`SYNC 0042`

`3 USERS`

`REV 018`

`02:41:09`

`X 042`

`Y 018`

`EDIT 00127`

`ONLINE 03`

`DOC 00042`

These should feel like part of the visual composition.

They must remain subtle.

Do NOT randomly scatter hundreds of numbers around the page.

Annotations should have a reason to exist and should reinforce the technical/editorial
identity of CollabNote.

---

# 9. Landing page

The landing page should NOT look like a conventional SaaS landing page.

Preferred structure:

1. Minimal navigation
2. Strong editorial hero
3. Large asymmetric geometric composition
4. Short explanation of the product
5. Product/editor preview
6. Collaboration explanation
7. Final CTA
8. Minimal footer

The hero should have:

- large typography
- substantial negative space
- asymmetric positioning
- a dominant black geometric element
- subtle technical annotations

Possible conceptual copy directions:

"Write together."

"One note. Everyone in sync."

"Writing, without the handoff."

"Your document. Everyone's cursor."

Do not blindly use these exact phrases.

Choose copy that accurately represents the current CollabNote functionality.

---

# 10. Navigation

Navigation should be minimal.

Avoid a large navigation bar with:

- many menu items
- multiple dropdowns
- excessive buttons
- large rounded containers

Prefer:

- small logo/name
- a few links
- one primary action

The navigation should visually disappear into the composition rather than becoming
the dominant component.

---

# 11. Landing page sections

Do not turn every section into cards.

Instead use:

- typography
- whitespace
- geometric transitions
- large surfaces
- asymmetric columns
- editorial layouts
- small technical labels

Cards may be used when they genuinely improve comprehension, but they should not
become the default layout primitive.

---

# 12. Working/editor page

The working page is the most important part of the application.

It must preserve the same visual identity as the landing page.

However, usability takes priority over visual experimentation.

The user should immediately understand:

- what document they are editing
- where the document content is
- who else is editing
- whether synchronization is active
- how to navigate
- how to share the document
- how to return to their documents

The editor itself should be calm.

Do not put distracting geometry behind the actual text.

---

# 13. Editor layout

A possible structure:

Top:

- document title
- save/sync state
- collaborator presence
- share/action controls

Left:

- optional document navigation
- document list
- compact controls

Center:

- large writing canvas
- comfortable reading width
- strong typography
- minimal distractions

Right:

- optional collaborator/presence information
- document metadata

Do not blindly implement all of these.

Use whatever structure fits the existing CollabNote architecture.

---

# 14. Editor typography

The writing area must be optimized for long-form reading and writing.

Prioritize:

- readable line length
- comfortable line height
- clear heading hierarchy
- adequate whitespace
- obvious cursor
- visible selection
- predictable scrolling

Do not sacrifice editor readability to reproduce the reference's visual density.

The decorative design should frame the editor.

It should not interfere with it.

---

# 15. Collaboration UI

Collaboration should be represented visually.

Useful elements:

- collaborator cursors
- collaborator names
- presence indicators
- active user count
- synchronization status
- subtle selection colors

A collaborator cursor can use the restrained blue accent.

Collaborator metadata can use tiny technical typography.

Example:

`AKKI — ONLINE`

`USER 02`

`CURSOR 184 / 42`

Do not overdo this.

The goal is to make collaboration feel like part of the visual identity.

---

# 16. Synchronization

CollabNote is collaborative.

The interface should communicate synchronization without annoying the user.

Good examples:

`SYNCED`

`SYNCING...`

`OFFLINE`

`SAVED 12:42`

These can appear as small technical labels.

Avoid giant toast notifications for routine synchronization events.

---

# 17. Buttons

Buttons should be minimal and architectural.

Prefer:

- rectangular shapes
- subtle borders
- restrained padding
- strong typography
- minimal radius

Avoid:

- giant pill buttons
- gradient buttons
- excessive shadows
- floating button collections

Primary actions should be obvious without looking like a generic SaaS CTA.

---

# 18. Borders and shadows

Use borders more than shadows.

Prefer:

- thin structural borders
- hard edges
- subtle gray lines
- black/white contrast

Avoid heavy shadows.

The reference relies heavily on flat surfaces and contrast.

Preserve that characteristic.

---

# 19. Border radius

Keep border radius low.

Use:

- `0`
- very small radius
- occasional modest radius only when usability requires it

Do not use rounded containers everywhere.

The visual language should have hard architectural edges.

---

# 20. Motion

Motion should be restrained.

Good animation:

- subtle cursor movement
- small geometric transitions
- gentle section reveal
- slight hover translation
- synchronization indicator transitions
- collaborator presence changes

Avoid:

- bouncing elements
- constant floating objects
- excessive parallax
- aggressive scroll animations
- animations that distract from writing

The interface should feel alive because people are collaborating, not because every
rectangle is moving.

---

# 21. Responsive design

Desktop should express the full visual language.

On tablets and mobile:

- simplify geometric artwork
- remove unnecessary technical annotations
- reduce oversized typography where necessary
- stack asymmetric layouts naturally
- maintain readable text
- preserve navigation usability
- preserve editor usability

Do NOT simply shrink the desktop layout.

Mobile should be intentionally composed.

Decorative elements must never cover:

- text
- navigation
- editor controls
- document content
- collaborator controls

---

# 22. Implementation principles

Before changing the UI:

1. Inspect the existing project.
2. Determine the framework.
3. Determine the existing styling system.
4. Determine the component structure.
5. Determine which parts are already functional.
6. Reuse existing functionality.
7. Modify the visual layer without unnecessarily rewriting business logic.

Do not rewrite working collaboration logic just because the UI is being redesigned.

Do not replace working components unless there is a clear reason.

Do not introduce a large dependency solely for decoration.

Prefer:

- CSS
- Tailwind
- SVG
- pseudo-elements
- existing animation utilities

over introducing unnecessary libraries.

---

# 23. Tailwind guidance

If the project uses Tailwind CSS, use Tailwind for most layout and styling.

However, do not force every unusual geometric design into enormous utility-class
strings.

For complicated geometry, create:

- dedicated components
- CSS classes
- SVG assets
- pseudo-elements

Keep the code readable.

---

# 24. Component philosophy

Components should represent meaningful UI concepts.

Good:

`Navigation`

`Hero`

`GeometricField`

`DocumentPreview`

`CollaboratorPresence`

`SyncStatus`

`EditorToolbar`

`DocumentSidebar`

`WritingCanvas`

Avoid creating dozens of tiny components simply to make the code look modular.

---

# 25. Visual consistency

The landing page and working page MUST look like the same application.

Shared characteristics should include:

- same typography
- same color system
- same geometry
- same technical annotation language
- same spacing philosophy
- same borders
- same interaction accent
- same overall visual tone

Do not create:

"beautiful experimental landing page"

followed by:

"generic white dashboard."

That is specifically what this skill is intended to prevent.

---

# 26. Accessibility

Visual experimentation must not break accessibility.

Maintain:

- readable contrast
- keyboard navigation
- visible focus states
- semantic HTML
- appropriate button labels
- usable editor controls
- reasonable font sizes

Do not use tiny decorative text as actual UI controls.

Technical annotations are decorative/supporting information unless explicitly stated
otherwise.

---

# 27. Performance

Keep the design lightweight.

Prefer CSS/SVG over large image assets where possible.

Avoid:

- unnecessarily large background images
- huge animation libraries
- continuously running JavaScript animations
- expensive canvas rendering for simple geometry

The geometric aesthetic should be achievable with lightweight web primitives.

---

# 28. Design decision priority

When making a design decision, prioritize in this order:

1. Functionality
2. Usability
3. Readability
4. Visual hierarchy
5. Consistency
6. Reference aesthetic
7. Decorative detail

Never sacrifice the first five merely to reproduce the reference.

---

# 29. Before implementation

Inspect the existing application before writing code.

Determine:

- current routes
- current pages
- existing components
- existing CSS/Tailwind setup
- editor implementation
- collaboration implementation
- authentication flow
- document state
- responsive behavior

Then create a plan for the visual changes.

Do not immediately rewrite the application.

---

# 30. After implementation

Review the result visually and technically.

Check:

- Does it feel inspired by the supplied reference?
- Is the composition asymmetric?
- Is the palette restrained?
- Is typography doing meaningful work?
- Are the black geometric forms intentional?
- Are the technical annotations subtle?
- Does the landing page avoid generic SaaS patterns?
- Does the working page feel like the same product?
- Is the editor comfortable to use?
- Does collaboration remain obvious?
- Does mobile remain usable?
- Did the redesign accidentally break existing functionality?

Fix visual inconsistencies and usability problems before declaring the task complete.

---

# 31. Important final rule

Do not make CollabNote look like the reference image.

Make CollabNote look like a product that could have been designed by the same
designer who created the reference.

The reference provides the visual language.

CollabNote provides the product language.
