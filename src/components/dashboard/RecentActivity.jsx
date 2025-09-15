import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    CheckCircle,
    XCircle,
    Clock,
    Terminal,
    Play
} from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ executionResults, scripts, isLoading }) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <div className="space-y-2 text-right">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (executionResults.length === 0) {
        return (
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Play className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Recent Activity</h3>
                    <p className="text-slate-600">
                        Execute some scripts to see activity history here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'timeout':
                return <Clock className="w-5 h-5 text-amber-500" />;
            default:
                return <Terminal className="w-5 h-5 text-slate-400" />;
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            success: "bg-emerald-100 text-emerald-800 border-emerald-200",
            error: "bg-red-100 text-red-800 border-red-200",
            timeout: "bg-amber-100 text-amber-800 border-amber-200"
        };
        return variants[status] || "bg-slate-100 text-slate-800 border-slate-200";
    };

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Play className="w-5 h-5 text-indigo-600" />
                    Recent Executions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    {executionResults.map((result) => {
                        const script = scripts.find(s => s.id === result.script_id);
                        return (
                            <div key={result.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
                                <div className="flex-shrink-0">
                                    {getStatusIcon(result.status)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-900 truncate">
                                        {script?.name || 'Unknown Script'}
                                    </h4>
                                    <p className="text-sm text-slate-600 truncate">
                                        {script?.description || 'No description'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className={`${getStatusBadge(result.status)} border font-medium`}>
                                        {result.status}
                                    </Badge>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-900">
                                            {result.execution_time ? `${result.execution_time}s` : '-'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {format(new Date(result.created_date), 'MMM d, HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}