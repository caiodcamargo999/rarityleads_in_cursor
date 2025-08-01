'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/Logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    return (
        <header className="relative overflow-x-clip">
            {/* Decorative abstract image background */}
            <div className="pointer-events-none select-none absolute top-1/2 right-0 z-0 w-[70vw] max-w-2xl -translate-y-1/2 translate-x-1/4 opacity-70 blur-[2px] brightness-110 saturate-150 drop-shadow-2xl lg:w-[50vw] lg:max-w-3xl lg:-top-32 lg:right-[-10vw] lg:translate-x-0 lg:opacity-80">
                <Image
                    src="https://ik.imagekit.io/lrigu76hy/tailark/abstract-bg.jpg?updatedAt=1745733473768"
                    alt="Abstract Diamond Background"
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                    draggable="false"
                />
            </div>
            {/* Navigation and content */}
            <nav
                data-state={menuState && 'active'}
                className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-[#0a0a0a]/50 max-w-4xl rounded-2xl border border-gray-800 backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-400 hover:text-white block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#0a0a0a] in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-800 p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-400 hover:text-white block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Link href="/auth">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        aria-label="Login"
                                        className={cn(
                                          isScrolled && 'lg:hidden',
                                          'transition-transform duration-200 border-white/20 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50 underline-offset-4 hover:underline'
                                        )}
                                    >
                                        <span>Login</span>
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        aria-label="Sign Up"
                                        className={cn(
                                          isScrolled && 'lg:hidden',
                                          'transition-transform duration-200 border-white/20 shadow-sm hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50 underline-offset-4 hover:underline'
                                        )}
                                    >
                                        <span>Sign Up</span>
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        aria-label="Get Started"
                                        className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                                    >
                                        <span>Get Started</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
} 