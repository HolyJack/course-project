import ThemeProvider from "./ThemeProvider";
import SessionProvider from "./AuthProviders";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
