import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Search,
    Code2,
    Terminal,
    Star,
    Clock,
    Play
} from "lucide-react";
import { format } from "date-fns";

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

export default function ScriptSelector({ scripts, selectedScript, onSelectScript, isLoading }) {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredScripts = scripts.filter(script =>
        script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-5 w-32" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="p-3 border rounded-lg space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Code2 className="w-5 h-5 text-indigo-600" />
                    Select Script
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search scripts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                </div>

                <ScrollArea className="h-96">
                    <div className="space-y-3 pr-4">
                        {filteredScripts.length === 0 ? (
                            <div className="text-center py-8">
                                <Code2 className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                                <p className="text-slate-600">No scripts found</p>
                                <p className="text-sm text-slate-500">Try adjusting your search</p>
                            </div>
                        ) : (
                            filteredScripts.map((script) => (
                                <div
                                    key={script.id}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                        selectedScript?.id === script.id
                                            ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                                    }`}
                                    onClick={() => onSelectScript(script)}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-medium text-slate-900 truncate flex-1">
                                                {script.name}
                                            </h4>
                                            {selectedScript?.id === script.id && (
                                                <Play className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-slate-600 line-clamp-2">
                                            {script.description || "No description provided"}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="secondary" className={`${categoryColors[script.category]} border text-xs font-medium`}>
                                                {script.category?.replace(/_/g, ' ')}
                                            </Badge>
                                            
                                            {script.is_cli_tool && (
                                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                                                    <Terminal className="w-3 h-3 mr-1" />
                                                    CLI
                                                </Badge>
                                            )}
                                            
                                            {script.is_favorite && (
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        {script.last_executed && (
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <Clock className="w-3 h-3" />
                                                Last run: {format(new Date(script.last_executed), 'MMM d, HH:mm')}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}