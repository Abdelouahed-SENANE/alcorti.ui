# Project Context

## Overview
This a Ui for Alcorti platform for transportation and logistics solutions

## Folder Structure (STRICT — do not deviate)

project-structure/
app/
    ├── admin
    │   ├── dashboard
    │   │   └── page.tsx
    │   ├── layout.tsx
    │   ├── locations
    │   │   └── page.tsx
    │   ├── users
    │   │   ├── [id]
    │   │   │   └── review
    │   │   │       └── page.tsx
    │   │   └── page.tsx
    │   └── vehicles
    │       └── page.tsx
    ├── auth
    │   ├── layout.tsx
    │   ├── login
    │   │   └── page.tsx
    │   └── register
    │       └── page.tsx
    ├── client
    │   ├── layout.tsx
    │   └── page.tsx
    ├── layout.tsx
    ├── not-found.tsx
    ├── page.tsx
    └── providers.tsx

|-- features/
    ├── admin
    │   ├── attachments
    │   │   └── attachments.type.ts
    │   ├── dashboard
    │   ├── locations
    │   │   ├── api
    │   │   │   ├── create.location.ts
    │   │   │   ├── delete.location.ts
    │   │   │   ├── location.list.ts
    │   │   │   ├── location.options.ts
    │   │   │   └── update.location.ts
    │   │   ├── components
    │   │   │   ├── location.delete-dialog.tsx
    │   │   │   ├── location.form.tsx
    │   │   │   ├── location.selector.tsx
    │   │   │   └── location.table.tsx
    │   │   └── location.type.ts
    │   ├── users
    │   │   ├── api
    │   │   │   ├── account-state.ts
    │   │   │   ├── user.details.ts
    │   │   │   ├── user.list.ts
    │   │   │   └── user.review.ts
    │   │   ├── components
    │   │   │   ├── account-state.dialog.tsx
    │   │   │   ├── user.review.skeleton.tsx
    │   │   │   ├── user.review.tsx
    │   │   │   └── user.table.tsx
    │   │   └── user.type.ts
    │   └── vehicles
    │       ├── api
    │       │   ├── create.vehicle.ts
    │       │   ├── delete.vehicle.ts
    │       │   ├── update.vehicle.ts
    │       │   ├── vehicle.list.ts
    │       │   └── vehicle.options.ts
    │       ├── components
    │       │   ├── vehicle.delete-dialog.tsx
    │       │   ├── vehicle.form.tsx
    │       │   ├── vehicle.selector.tsx
    │       │   └── vehicle.table.tsx
    │       └── vehicle.type.ts
    ├── auth
    │   ├── api
    │   │   ├── client.complete.ts
    │   │   └── shipper.complete.ts
    │   └── components
    │       ├── login.form.tsx
    │       ├── onboarding
    │       │   ├── banned.gate.tsx
    │       │   ├── client-complete.form.tsx
    │       │   ├── completion.gate.tsx
    │       │   ├── pending.gate.tsx
    │       │   ├── rejected.gate.tsx
    │       │   └── shipper-complete.form.tsx
    │       └── register.form.tsx
    ├── client
    │   ├── api
    │   └── components
    └── shipper
        ├── api
        └── components├── admin
    │   ├── attachments
    │   │   └── attachments.type.ts
    │   ├── dashboard
    │   ├── locations
    │   │   ├── api
    │   │   │   ├── create.location.ts
    │   │   │   ├── delete.location.ts
    │   │   │   ├── location.list.ts
    │   │   │   ├── location.options.ts
    │   │   │   └── update.location.ts
    │   │   ├── components
    │   │   │   ├── location.delete-dialog.tsx
    │   │   │   ├── location.form.tsx
    │   │   │   ├── location.selector.tsx
    │   │   │   └── location.table.tsx
    │   │   └── location.type.ts
    │   ├── users
    │   │   ├── api
    │   │   │   ├── account-state.ts
    │   │   │   ├── user.details.ts
    │   │   │   ├── user.list.ts
    │   │   │   └── user.review.ts
    │   │   ├── components
    │   │   │   ├── account-state.dialog.tsx
    │   │   │   ├── user.review.skeleton.tsx
    │   │   │   ├── user.review.tsx
    │   │   │   └── user.table.tsx
    │   │   └── user.type.ts
    │   └── vehicles
    │       ├── api
    │       │   ├── create.vehicle.ts
    │       │   ├── delete.vehicle.ts
    │       │   ├── update.vehicle.ts
    │       │   ├── vehicle.list.ts
    │       │   └── vehicle.options.ts
    │       ├── components
    │       │   ├── vehicle.delete-dialog.tsx
    │       │   ├── vehicle.form.tsx
    │       │   ├── vehicle.selector.tsx
    │       │   └── vehicle.table.tsx
    │       └── vehicle.type.ts
    ├── auth
    │   ├── api
    │   │   ├── client.complete.ts
    │   │   └── shipper.complete.ts
    │   └── components
    │       ├── login.form.tsx
    │       ├── onboarding
    │       │   ├── banned.gate.tsx
    │       │   ├── client-complete.form.tsx
    │       │   ├── completion.gate.tsx
    │       │   ├── pending.gate.tsx
    │       │   ├── rejected.gate.tsx
    │       │   └── shipper-complete.form.tsx
    │       └── register.form.tsx
    ├── client
    │   ├── api
    │   └── components
    └── shipper
        ├── api
        └── components
|-- components/
    ├── charts
│   ├── chart-skeleton.tsx
│   ├── line-chart.tsx
│   ├── metric-card.tsx
│   └── radial-chart.tsx
├── layouts
│   ├── _auth-layout.tsx
│   ├── _dash-layout.tsx
│   └── _err-layout.tsx
└── ui
    ├── autocomplete.tsx
    ├── avatar
    │   ├── avatar.tsx
    │   └── index.ts
    ├── avatar.tsx
    ├── badge
    │   ├── badge.tsx
    │   └── index.ts
    ├── breadcrumb
    │   ├── breadcrumb.tsx
    │   └── index.ts
    ├── button
    │   ├── button.tsx
    │   └── index.ts
    ├── calendar
    │   ├── calendar.tsx
    │   └── index.ts
    ├── card
    │   ├── card.tsx
    │   └── index.ts
    ├── collapsible.tsx
    ├── command
    │   ├── command.tsx
    │   └── index.ts
    ├── dialog
    │   ├── confirmation
    │   │   └── confirmation-dialog.tsx
    │   ├── dialog.tsx
    │   └── index.ts
    ├── document-viewer
    │   ├── document-viewer.css
    │   ├── document-viewer.skeleton.tsx
    │   └── document-viewer.tsx
    ├── drawer
    │   ├── drawer.tsx
    │   └── index.ts
    ├── dropdown
    │   ├── dropdown-menu.tsx
    │   └── index.ts
    ├── footer
    │   └── footer.tsx
    ├── form
    │   ├── autocomplete.tsx
    │   ├── checkbox.tsx
    │   ├── custom-select.tsx
    │   ├── date-input.tsx
    │   ├── field-wrapper.tsx
    │   ├── file-input.tsx
    │   ├── form-drawer.tsx
    │   ├── form-modal.tsx
    │   ├── form.tsx
    │   ├── image-upload.tsx
    │   ├── index.ts
    │   ├── input-calander.tsx
    │   ├── input-datetime.tsx
    │   ├── input-error.tsx
    │   ├── input-time.tsx
    │   ├── input.tsx
    │   ├── label.tsx
    │   ├── multi-autocomplete.tsx
    │   ├── numeric-input.tsx
    │   ├── radio-cards.tsx
    │   ├── radio-input.tsx
    │   ├── reference-input.tsx
    │   ├── search-input.tsx
    │   ├── select.tsx
    │   ├── switch.tsx
    │   └── textarea.tsx
    ├── icons
    │   └── sort-icon.tsx
    ├── language
    │   └── switch-language.tsx
    ├── link
    │   ├── index.ts
    │   └── link.tsx
    ├── navbar
    │   └── navbar.tsx
    ├── popover
    │   ├── index.ts
    │   └── popover.tsx
    ├── quick-actions
    │   ├── index.ts
    │   └── quick-actions.tsx
    ├── remote-selector.tsx
    ├── scroll-area
    │   ├── index.ts
    │   └── scroll-area.tsx
    ├── scroll-area.tsx
    ├── sidebar
    │   ├── index.ts
    │   └── sidebar.tsx
    ├── skeleton
    │   ├── index.tsx
    │   └── skeleton.tsx
    ├── spinner
    │   ├── index.ts
    │   └── spinner.tsx
    ├── table
    │   ├── index.ts
    │   ├── table-pagination.tsx
    │   ├── table-skeleton.tsx
    │   ├── table.tsx
    │   └── use-query-table.ts
    ├── tabs
    │   ├── index.ts
    │   └── tabs.tsx
    ├── theme
    │   ├── index.ts
    │   ├── theme-provider.tsx
    │   └── theme-toggle.tsx
    ├── timeline
    │   └── timeline.tsx
    ├── toast
    │   ├── constants.ts
    │   ├── toaster.tsx
    │   ├── toast.tsx
    │   └── use-toast.ts
    ├── topbar
    │   ├── index.ts
    │   └── topbar.tsx
    └── user-navigation
        ├── index.ts
        └── user-navigation.tsx

## Rules
- NEW utility? → `utils/` (one function per file)
- NEW features API call? → `features/api`
- NEW features Components call? → `features/components`
- NEW components API call? → `components/ui/components-name/component.tsx`


## Naming Conventions
- Files: `kebab.case.ts` (e.g., `user.component.tsx` , `user.action.ts` )
- Functions/variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Test files: `*.test.ts` next to the file OR mirrored in `tests/`

## Code Style
- TypeScript strict mode — no `any`
- Use `tsx` extension for all React components return JSX
- Use `ts` extension for all api call functions

## Before You Finish a Task
1. Run `npm run lint` and fix errors
2. Update relevant docs in `/docs`

## Things to Ask Before Doing
- Adding a new dependency (check if existing libs cover it)
- Changing the folder structure
- Modifying shared utilities used across the codebase
- Deleting files