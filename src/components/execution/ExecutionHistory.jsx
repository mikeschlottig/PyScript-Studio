import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    History,
    CheckCircle,
    XCircle,
    Clock,
    Terminal,
    Play,
    AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

export default function ExecutionHistory({ 
    executionResults, 
    scripts, 
    isLoading, 
    onSelectScript 
}) {
    if (isLoading) {
        return (
            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                <CardHeader className="p-6">
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Skeleton className="w-5 h-5" />
                        <Skeleton className="h-6 w-40" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="space-y-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <Skeleton className="h-5 w-1/3" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <Skeleton className="h-4 w-2/3 mb-2" />
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'timeout':
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            default:
                return <Terminal className="w-4 h-4 text-slate-400" />;
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
                    <History className="w-5 h-5 text-slate-700" />
                    Execution History
                </CardTitle>
                <p className="text-slate-600 mt-1">
                    Recent script executions and their results
                </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                {executionResults.length === 0 ? (
                    <div className="text-center py-12">
                        <History className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Execution History</h3>
                        <p className="text-slate-600 mb-6">
                            Execute some scripts to see history here.
                        </p>
                    </div>
                ) : (
                    <ScrollArea className="h-96">
                        <div className="space-y-4 pr-4">
                            {executionResults.map((result) => {
                                const script = scripts.find(s => s.id === result.script_id);
                                return (
                                    <div key={result.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                {getStatusIcon(result.status)}
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-slate-900 truncate">
                                                        {script?.name || 'Unknown Script'}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 truncate">
                                                        {script?.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-3">
                                                <Badge variant="secondary" className={`${getStatusBadge(result.status)} border text-xs font-medium`}>
                                                    {result.status}
                                                </Badge>
                                                {script && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => onSelectScript(script)}
                                                        className="hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
                                                    >
                                                        <Play className="w-3 h-3 mr-1" />
                                                        Run Again
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {result.args && result.args.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-xs font-medium text-slate-500">Arguments:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {result.args.map((arg, index) => (
                                                        <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono">
                                                            {arg}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    {result.execution_time ? `${result.execution_time}s` : '-'}
                                                </div>
                                                <span className="text-slate-500">
                                                    {format(new Date(result.created_date), 'MMM d, HH:mm')}
                                                </span>
                                            </div>
                                        </div>

                                        {(result.output || result.error) && (
                                            <details className="mt-3">
                                                <summary className="text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                                                    View Output
                                                </summary>
                                                <div className="mt-2 p-3 bg-slate-50 rounded border">
                                                    {result.error ? (
                                                        <pre className="text-red-600 text-xs font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                                                            {result.error}
                                                        </pre>
                                                    ) : (
                                                        <pre className="text-slate-700 text-xs font-mono whitespace-pre-wrap max-h-32 overflow-auto">
                                                            {result.output}
                                                        </pre>
                                                    )}
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}