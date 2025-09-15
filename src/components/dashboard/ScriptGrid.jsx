import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Star,
    Terminal,
    Code2,
    Play,
    Edit,
    MoreVertical,
    Calendar,
    Tag
} from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
    automation: "bg-blue-100 text-blue-800 border-blue-200",
    data_processing: "bg-green-100 text-green-800 border-green-200",
    web_scraping: "bg-purple-100 text-purple-800 border-purple-200",
    utilities: "bg-orange-100 text-orange-800 border-orange-200",
    cli_tools: "bg-indigo-100 text-indigo-800 border-indigo-200",
    analysis: "bg-pink-100 text-pink-800 border-pink-200",
    testing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function ScriptGrid({ scripts, isLoading, onRefresh, emptyMessage }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                        <CardHeader className="p-6 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <Skeleton className="w-8 h-8 rounded-full" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="flex gap-2">
                                        <Skeleton className="w-8 h-8 rounded-lg" />
                                        <Skeleton className="w-8 h-8 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (scripts.length === 0) {
        return (
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Code2 className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Scripts Found</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        {emptyMessage || "Start by creating your first Python script to organize and execute your code."}
                    </p>
                    <Link to={createPageUrl("ScriptEditor")}>
                        <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                            <Code2 className="w-4 h-4 mr-2" />
                            Create First Script
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => (
                <Card key={script.id} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 group">
                    <CardHeader className="p-6 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate text-lg group-hover:text-indigo-600 transition-colors duration-200">
                                    {script.name}
                                </h3>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                    {script.description || "No description provided"}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Script
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Star className="w-4 h-4 mr-2" />
                                        {script.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Badge 
                                variant="secondary" 
                                className={`${categoryColors[script.category]} border font-medium`}
                            >
                                <Tag className="w-3 h-3 mr-1" />
                                {script.category?.replace(/_/g, ' ')}
                            </Badge>
                            {script.is_cli_tool && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                    <Terminal className="w-3 h-3 mr-1" />
                                    CLI
                                </Badge>
                            )}
                            {script.is_favorite && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                </Badge>
                            )}
                        </div>

                        {script.tags && script.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {script.tags.slice(0, 3).map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {script.tags.length > 3 && (
                                    <span className="text-xs text-slate-400 px-2 py-1">
                                        +{script.tags.length - 3} more
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(script.updated_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex gap-2">
                                <Link to={createPageUrl(`ExecutionHub?script=${script.id}`)}>
                                    <Button size="sm" variant="outline" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                                        <Play className="w-3 h-3 mr-1" />
                                        Run
                                    </Button>
                                </Link>
                                <Link to={createPageUrl(`ScriptEditor?id=${script.id}`)}>
                                    <Button size="sm" variant="outline" className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700">
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}