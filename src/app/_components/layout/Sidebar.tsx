"use client";
import { Home, ShoppingCartIcon, Package, LogOut} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' 

interface SidebarProps {
    onClose?: () => void;
    isCollapsed?: boolean;
}

export default function Sidebar({ onClose, isCollapsed = false }: SidebarProps) {
    const pathname = usePathname()

    const navigation = [
        { name: 'Dashboard', href: '/', icon: Home },
        { name: 'Programs', href: '/programs', icon: ShoppingCartIcon },
        { name: 'Clients', href: '/clients', icon: Package }, 
    ]

    return (
        <aside className={`h-full flex flex-col bg-white border-r transition-all duration-300 ease-in-out ${isCollapsed ? "w-16" : "w-64"}`}>

            <div className="flex h-16 items-center gap-2 px-4 border-b">
                <div className="h-7 w-7 rounded-md bg-indigo-600" />
                {!isCollapsed && (
                    <span className="text-lg font-semibold">CareSync</span>
                )} 
            </div>

            <nav className="flex-1 space-y-5 px-2 py-4 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors 
                ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}
              `}
                            onClick={() => onClose?.()}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            {!isCollapsed && item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t p-4">
                <button
                    onClick={() => {
                        onClose?.()
                    }}
                    className={`flex w-full items-center ${isCollapsed ? "justify-center" : "justify-start"} gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors`}
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && "Logout"}
                </button>
            </div>
        </aside>
    )
}
