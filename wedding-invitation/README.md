# Wedding Invitation Project

This static invitation is structured as a modular site with separated concerns:

- `index.html` contains semantic markup
- `css/` stores variables, resets, component styles, and sections
- `js/config/wedding.config.js` contains all user-editable text and dates
- `js/components/` contains behavior for the envelope, countdown, and RSVP
- `js/utils/` contains shared rendering and reveal logic

## Customize quickly

Edit the fields in `js/config/wedding.config.js` to change:

- names of the couple
- wedding date and RSVP deadline
- venue name and address
- program schedule
- UI labels and Russian/Kyrgyz wording

## Run locally

From this folder, use any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
