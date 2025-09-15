import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Code2,
    Star,
    Terminal,
    Zap,
    TrendingUp
} from "lucide-react";

export default function StatsOverview({ stats, isLoading }) {
    const statCards = [
        {
            title: "Total Scripts",
            value: stats.totalScripts,
            icon: Code2,
            bgColor: "from-indigo-500 to-indigo-600",
            textColor: "text-indigo-600"
        },
        {
            title: "Favorites",
            value: stats.favoriteScripts,
            icon: Star,
            bgColor: "from-amber-500 to-amber-600",
            textColor: "text-amber-600"
        },
        {
            title: "CLI Tools",
            value: stats.cliTools,
            icon: Terminal,
            bgColor: "from-emerald-500 to-emerald-600",
            textColor: "text-emerald-600"
        },
        {
            title: "Recent Executions",
            value: stats.recentExecutions,
            icon: Zap,
            bgColor: "from-purple-500 to-purple-600",
            textColor: "text-purple-600"
        },
        {
            title: "Success Rate",
            value: `${stats.successRate}%`,
            icon: TrendingUp,
            bgColor: "from-rose-500 to-rose-600",
            textColor: "text-rose-600"
        }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {Array(5).fill(0).map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-6 w-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {statCards.map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm bg-white/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200`}>
                                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}