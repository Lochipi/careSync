import { Bell, Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="border-b bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-gray-100 relative hidden sm:flex"
                    >
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
