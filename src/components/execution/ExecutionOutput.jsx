import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Terminal,
    Copy,
    CheckCircle,
    AlertCircle,
    Clock,
    Loader2
} from "lucide-react";

export default function ExecutionOutput({ 
    output, 
    error, 
    executionTime, 
    isExecuting, 
    selectedScript 
}) {
    const [copied, setCopied] = React.useState(false);

    const copyOutput = () => {
        const textToCopy = error ? error : output;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusBadge = () => {
        if (isExecuting) {
            return (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Running
                </Badge>
            );
        }
        if (error) {
            return (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Error
                </Badge>
            );
        }
        if (output) {
            return (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Success
                </Badge>
            );
        }
        return null;
    };

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-slate-700" />
                        <div>
                            <CardTitle className="text-xl">Execution Output</CardTitle>
                            {selectedScript && (
                                <p className="text-sm text-slate-600 mt-1">
                                    Running: {selectedScript.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        {(output || error) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyOutput}
                                className="hover:bg-slate-50"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    {/* Execution Info */}
                    {(executionTime > 0 || isExecuting) && (
                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="font-medium text-slate-700">Execution Time:</span>
                                <span className="text-slate-600">
                                    {isExecuting ? "Running..." : `${executionTime.toFixed(2)}s`}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Output Display */}
                    <div className="relative">
                        <ScrollArea className="h-96 w-full rounded-lg border border-slate-200 bg-slate-900">
                            <div className="p-4">
                                {isExecuting ? (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="font-mono text-sm">Executing script...</span>
                                    </div>
                                ) : error ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-red-400 mb-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="font-medium">Execution Error</span>
                                        </div>
                                        <pre className="text-red-300 font-mono text-sm whitespace-pre-wrap">
                                            {error}
                                        </pre>
                                    </div>
                                ) : output ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-green-400 mb-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium">Output</span>
                                        </div>
                                        <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                                            {output}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Terminal className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                                        <p className="text-slate-400 text-sm">
                                            No output yet. Select a script and click Execute to run it.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Tips */}
                    {!selectedScript && !isExecuting && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <h4 className="font-medium text-indigo-900 mb-2">Getting Started</h4>
                            <ul className="text-sm text-indigo-700 space-y-1">
                                <li>• Select a script from the left panel</li>
                                <li>• Configure arguments if needed</li>
                                <li>• Click Execute to run the script</li>
                                <li>• Use Quick Execute for one-off code snippets</li>
                            </ul>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}