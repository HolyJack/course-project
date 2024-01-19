export default function Main({ children }: React.PropsWithChildren) {
  return (
    <main>
      <div className="bg-background relative px-4">
        <div className="container mx-auto flex h-full min-h-[calc(100vh-5rem)] py-5">
          {children}
        </div>
      </div>
    </main>
  );
}
