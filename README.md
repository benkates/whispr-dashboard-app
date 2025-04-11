# Whispr Dashbaord App

Ben Kates, April 2025

## Setup and Preview

Run `npm run install` to install the required packages.
Run `npm run dev` to start the development server.
Run `npm run build` to build the app for production.
Run `npm run preview` to preview the production build.

## Tools

This application makes use of React, TypeScript, Tailwind, [shadcn/ui](https://ui.shadcn.com/), and [ApexCharts](https://apexcharts.com/react-chart-demos/). Typescript is largely ignored in the interest of time.

In the interest of time, the following decisions were made:

- `shadcn/ui` components use default component styling
- No Tailwind implementation of design spec from Figma document
- ApexCharts vs. a custom d3.js approach (allow for more customization)
  - The visualization choices are explained in the Figma document's comments. ApexCharts allowed for an easy implementation of these.

### GitHub Copilot

GitHub Copilot was used for small, repeatable coding tasks and is otherwise noted in the comments when it was used. It was not used for large development tasks or architecture decisions.

### Note about `shadcn/ui`

`[shadcn/ui](https://ui.shadcn.com/)` is a collection of components built on top of Radix UI and Tailwind CSS. It provides a set of accessible and responsive pre-designed components that can be easily customized and used in a React applications. `src/components/ui` contains the generated components.

**You can check out examples of my custom CSS/HTML/component work [on my portfolio](https://benkates.com/).**

## Technical Implementation

### Fake API

The `src/fakeApi.ts` file contains a fake API that simulates the behavior of a real, dynamically called API. It makes a real fetch request to the provided csv file in the `public` directory based on the app's filters.

### Bot Detection

In the fake API call is the addition of a field that detects if the Q3 open ended response is a duplicate, signaling that it is a bot. This is a _very_ basic bot detection algorithm to provide a filter option in the application. In the future, this could "facet" the Question 2 visualization (aligned with the Figma spec).

### State Management

A very basic (long) `useState` + `useEffect` list is used in the `App.tsx` to reduce dev time. With more time, a state management library like Redux or Zustand could be implemented.

## Performance Optimization Thoughts for Larger Datasets

- Bring back summarized datasets (instead of rows + grouping on the frontend)
- Work with backend team on tying API endpoints to visualization forms based on chart type and data required
- Canvas-based visualizations instead of SVG if rendering many nodes
- Server-side rendering (SSR) of frontend elements when appropriate
- Debounce API calls and allow for pagination/caching
