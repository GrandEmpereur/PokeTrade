export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gray-100 min-h-screen">
            <main className="p-4">
                {children}
            </main>
        </div>
    )
}  