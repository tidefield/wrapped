# Garmin Wrapped

A privacy-focused, client-only Garmin activity wrapped experience.

## Running the Demo

```bash
npm install
npm run dev
```

Open http://localhost:5173/ in your browser.

## Current Status

The UI is fully functional with mock data. Navigate through slides using:

- Arrow buttons
- Keyboard arrows (← →)
- Progress dots

## Project Structure

```
wrapped/
├── index.html              # Main HTML file
├── styles/main.css         # All styling and animations
├── src/
│   ├── main.ts            # App initialization and navigation
│   ├── slides.ts          # Story slide definitions
│   ├── mockData.ts        # Mock data generator (replace with real data)
│   ├── types.ts           # TypeScript interfaces
│   └── style.css          # Additional styles
└── package.json
```

## Customizing with Your Data

### Data Structure

The app expects a `WrappedStats` object (see `src/types.ts`):

```typescript
interface WrappedStats {
  year: number;
  totalActivities: number;
  totalDistance: number; // in meters
  totalDuration: number; // in seconds
  totalCalories: number;
  totalElevationGain: number; // in meters
  activeDays: number;
  longestDistance: number; // in meters
  longestDuration: number; // in seconds
  avgHeartRate: number;
  maxHeartRate: number;
  favoriteActivity: string;
  activitiesByMonth: { month: string; count: number }[];
  topStats: { label: string; value: string }[];
}
```

### How to Add Your Data

1. **Replace mock data** in `src/mockData.ts` or `src/main.ts`
2. **Add a data loader** - create a function that returns your `WrappedStats` object
3. **Customize slides** in `src/slides.ts` to match your available data

## Styling

All styles are in `styles/main.css`. Key things you can customize:

- **Colors**: Change the gradient in `body { background: ... }`
- **Fonts**: Update the font-family
- **Animations**: Adjust transitions and keyframes
- **Layout**: Modify slide layouts in `.story-slide` classes

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory. This is a static site - host it anywhere (GitHub Pages, Netlify, Vercel, etc).

## Privacy

This app is 100% client-side. No data is sent to any server. Everything runs in your browser.
