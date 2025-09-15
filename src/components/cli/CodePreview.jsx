import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Code2, Download, Check } from "lucide-react";

export default function CodePreview({ code, framework, onCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cli_tool.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getFrameworkColor = (framework) => {
        const colors = {
            click: "bg-blue-100 text-blue-800 border-blue-200",
            typer: "bg-purple-100 text-purple-800 border-purple-200",
            argparse: "bg-green-100 text-green-800 border-green-200"
        };
        return colors[framework] || "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Code2 className="w-5 h-5 text-slate-700" />
                        <div>
                            <CardTitle className="text-xl">Generated Code</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className={`${getFrameworkColor(framework)} border font-medium`}>
                                    {framework}
                                </Badge>
                                <span className="text-sm text-slate-600">
                                    {code.split('\n').length} lines
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={downloadCode}
                            className="hover:bg-slate-50"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className={`hover:bg-slate-50 transition-colors duration-200 ${
                                copied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''
                            }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="relative">
                    <Textarea
                        value={code}
                        readOnly
                        className="font-mono text-sm border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 min-h-[500px] resize-none bg-slate-50/50"
                        spellCheck={false}
                    />
                    <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/80 backdrop-blur-sm text-xs">
                            Python
                        </Badge>
                    </div>
                </div>
                
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Usage Instructions</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p>1. Save the code to a file (e.g., <code className="bg-slate-200 px-1 rounded">cli_tool.py</code>)</p>
                        <p>2. Make it executable: <code className="bg-slate-200 px-1 rounded">chmod +x cli_tool.py</code></p>
                        {framework !== "argparse" && (
                            <p>3. Install dependencies: <code className="bg-slate-200 px-1 rounded">pip install {framework}</code></p>
                        )}
                        <p>4. Run your CLI tool: <code className="bg-slate-200 px-1 rounded">python cli_tool.py --help</code></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}