import React, { useState, useEffect } from "react";
import { Script } from "@/api/entities";
import { ExecutionResult } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Code2, 
    Plus, 
    Search, 
    Filter,
    Star,
    Terminal,
    Clock,
    Zap,
    TrendingUp,
    Play
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import StatsOverview from "../components/dashboard/StatsOverview";
import ScriptGrid from "../components/dashboard/ScriptGrid";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
    const [scripts, setScripts] = useState([]);
    const [executionResults, setExecutionResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [scriptsData, resultsData] = await Promise.all([
                Script.list("-updated_date"),
                ExecutionResult.list("-created_date", 20)
            ]);
            setScripts(scriptsData);
            setExecutionResults(resultsData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredScripts = scripts.filter(script => {
        const matchesSearch = script.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             script.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             script.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || script.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = [
        { value: "all", label: "All Scripts", count: scripts.length },
        { value: "automation", label: "Automation", count: scripts.filter(s => s.category === "automation").length },
        { value: "data_processing", label: "Data Processing", count: scripts.filter(s => s.category === "data_processing").length },
        { value: "web_scraping", label: "Web Scraping", count: scripts.filter(s => s.category === "web_scraping").length },
        { value: "utilities", label: "Utilities", count: scripts.filter(s => s.category === "utilities").length },
        { value: "cli_tools", label: "CLI Tools", count: scripts.filter(s => s.category === "cli_tools").length }
    ];

    const stats = {
        totalScripts: scripts.length,
        favoriteScripts: scripts.filter(s => s.is_favorite).length,
        cliTools: scripts.filter(s => s.is_cli_tool).length,
        recentExecutions: executionResults.length,
        successRate: executionResults.length > 0 
            ? Math.round((executionResults.filter(r => r.status === "success").length / executionResults.length) * 100)
            : 0
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                            Script Dashboard
                        </h1>
                        <p className="text-slate-600 mt-2 text-lg">
                            Manage, organize, and execute your Python scripts
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <Link to={createPageUrl("ScriptEditor")}>
                            <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
                                <Plus className="w-4 h-4 mr-2" />
                                New Script
                            </Button>
                        </Link>
                        <Link to={createPageUrl("CLIBuilder")}>
                            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300">
                                <Terminal className="w-4 h-4 mr-2" />
                                CLI Builder
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <StatsOverview stats={stats} isLoading={isLoading} />

                {/* Search and Filters */}
                <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search scripts, tags, or descriptions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="border-slate-200 hover:border-slate-300">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <Tabs defaultValue="scripts" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-100/60 p-1 rounded-xl">
                        <TabsTrigger value="scripts" className="rounded-lg font-medium">
                            All Scripts
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="rounded-lg font-medium">
                            Favorites
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-lg font-medium">
                            Recent Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scripts" className="space-y-6">
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Button
                                    key={category.value}
                                    variant={selectedCategory === category.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`rounded-full transition-all duration-200 ${
                                        selectedCategory === category.value
                                            ? "bg-indigo-500 hover:bg-indigo-600 shadow-md"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {category.label}
                                    <Badge 
                                        variant="secondary" 
                                        className={`ml-2 ${
                                            selectedCategory === category.value 
                                                ? "bg-indigo-400/30 text-indigo-100" 
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {category.count}
                                    </Badge>
                                </Button>
                            ))}
                        </div>

                        <ScriptGrid 
                            scripts={filteredScripts} 
                            isLoading={isLoading}
                            onRefresh={loadData}
                        />
                    </TabsContent>

                    <TabsContent value="favorites">
                        <ScriptGrid 
                            scripts={scripts.filter(s => s.is_favorite)} 
                            isLoading={isLoading}
                            onRefresh={loadData}
                            emptyMessage="No favorite scripts yet. Click the star icon on any script to add it to favorites."
                        />
                    </TabsContent>

                    <TabsContent value="activity">
                        <RecentActivity 
                            executionResults={executionResults}
                            scripts={scripts}
                            isLoading={isLoading}
                        />
                    </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <QuickActions />
            </div>
        </div>
    );
}