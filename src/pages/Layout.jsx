
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
    Code2, 
    Terminal, 
    FolderOpen, 
    Settings, 
    ChevronLeft, 
    ChevronRight,
    Play,
    Star,
    Hash
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
    {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: FolderOpen,
        description: "Script overview"
    },
    {
        title: "Script Editor",
        url: createPageUrl("ScriptEditor"),
        icon: Code2,
        description: "Create & edit scripts"
    },
    {
        title: "CLI Builder",
        url: createPageUrl("CLIBuilder"),
        icon: Terminal,
        description: "Build CLI tools"
    },
    {
        title: "Execution Hub",
        url: createPageUrl("ExecutionHub"),
        icon: Play,
        description: "Run & monitor scripts"
    }
];

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [toolPanelCollapsed, setToolPanelCollapsed] = useState(true);

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-slate-50">
                {/* Main Sidebar */}
                <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
                    <SidebarHeader className="border-b border-slate-200/60 p-6">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Code2 className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                    PyScript Studio
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Python Script Manager
                                </p>
                            </div>
                        </div>
                    </SidebarHeader>
                    
                    <SidebarContent className="p-4">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-3">
                                Navigation
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigationItems.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton 
                                                asChild 
                                                className={`group rounded-xl transition-all duration-200 hover:bg-slate-50 hover:shadow-sm ${
                                                    location.pathname === item.url 
                                                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                                                        : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                <Link to={item.url} className="flex items-center gap-3 px-3 py-3">
                                                    <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                                                        location.pathname === item.url ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                                                    }`} />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">{item.title}</div>
                                                        <div className="text-xs text-slate-400 group-hover:text-slate-500">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarGroup className="mt-8">
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-3">
                                Quick Access
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="px-3 py-2 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-amber-500" />
                                            <span className="text-slate-600 font-medium">Favorites</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-xs px-2 py-1">
                                            0
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-emerald-500" />
                                            <span className="text-slate-600 font-medium">Recent</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1">
                                            0
                                        </Badge>
                                    </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-slate-200/60 p-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50">
                            <div className="w-9 h-9 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                                <span className="text-slate-600 font-semibold text-sm">U</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm truncate">Developer</p>
                                <p className="text-xs text-slate-500 truncate">Script Manager</p>
                            </div>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <div className="flex-1 flex flex-col">
                    {/* Mobile Header */}
                    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                PyScript Studio
                            </h1>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 flex">
                        <div className={`flex-1 transition-all duration-300 ${toolPanelCollapsed ? 'mr-0' : 'mr-80'}`}>
                            {children}
                        </div>

                        {/* Tool Panel */}
                        <div className={`fixed right-0 top-0 h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/60 shadow-xl transition-transform duration-300 ${
                            toolPanelCollapsed ? 'translate-x-full' : 'translate-x-0'
                        } w-80 z-50`}>
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-slate-200/60">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-slate-900">CLI Tools</h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setToolPanelCollapsed(true)}
                                            className="hover:bg-slate-100"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 p-4">
                                    <p className="text-sm text-slate-500 text-center py-8">
                                        No CLI tools available.<br />
                                        Create one in the CLI Builder.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tool Panel Toggle (when collapsed) */}
                        {toolPanelCollapsed && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setToolPanelCollapsed(false)}
                                className="fixed right-4 top-1/2 -translate-y-1/2 z-40 shadow-lg bg-white/90 backdrop-blur-sm border-slate-200/60 hover:bg-slate-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
