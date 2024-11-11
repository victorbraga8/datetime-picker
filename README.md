# Next.js Project with DateTime Picker Customization

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Feature: Date and Time Picker with Automatic Date and Time Setting

In this project, we implemented a customized DateTime picker component with the following features:

1. **Automatic Date and Time Filling on Calendar Open (Commented Out)**:

   - We added a functionality that, when enabled, will automatically fill the current date and time into the picker whenever the calendar is opened. This feature is currently commented out to keep the component’s behavior manual by default.
   - To enable this feature, uncomment the `useEffect` block responsible for setting the date and time in the picker. This `useEffect` will check if the calendar is open (`isCalendarOpen` is true) and if no date has been set (`dateTime` is empty). It will then set the current date and time.

2. **Automatic Time Setting on Date Selection**:

   - When the user selects a date manually from the calendar, the time fields are automatically filled with the current time, ensuring the component always shows accurate timing for manual selections.

3. **Optimized State and Effect Management**:

   - The component uses optimized `useEffect` hooks and dependencies to minimize unnecessary re-renders. By storing `dateTime` outside of the `useEffect` dependencies and controlling updates based on `isCalendarOpen`, we ensure efficient and predictable behavior.

4. **Local Date and Time Handling**:
   - The picker captures and displays the local date and time based on the user's system settings, without manual adjustments for time zones. This ensures consistency and simplicity, especially for users across different time zones.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
