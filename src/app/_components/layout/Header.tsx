import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="border-b bg-white">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex flex-1 items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search anything..."
                            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>
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
