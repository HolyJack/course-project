import ThemeProvider from "./ThemeProvider";
import SessionProvider from "./AuthProviders";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
}
