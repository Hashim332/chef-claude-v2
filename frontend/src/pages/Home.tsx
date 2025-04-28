export default function Home() {
  return (
    <div>
      <h1 className="text-4xl">Enter some ingredients to get started</h1>
      <div>
        To make the footer match your app's theme (whether it's light or dark)
        and ensure it stays at the bottom of the page, you can use CSS variables
        from your theme and add some specific positioning styles. Here's how to
        do both: Theme-Aware Footer ComponentCode  To ensure the footer is
        always at the bottom of the page, you need to set up your main layout
        structure properly. Here's how to do that: Layout Structure to Keep
        Footer at BottomCode  Key points to note: Theme matching: I'm using CSS
        variables from your theme (like bg-background, text-foreground,
        border-border) instead of hardcoded values. These will automatically
        adapt to light/dark mode based on your theme context. Keeping the footer
        at the bottom: The layout uses a flex column that's at least the height
        of the viewport (min-h-screen) The main content uses flex-grow to expand
        and take up available space The footer will stay at the bottom even if
        there's not enough content to fill the page Wrap your entire app with
        this layout component, and your footer will always stick to the bottom
        and adapt to your current theme.
      </div>
    </div>
  );
}
