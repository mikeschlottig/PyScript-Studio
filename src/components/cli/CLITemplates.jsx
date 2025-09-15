import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, Terminal, FileText, Download, Database } from "lucide-react";

export default function CLITemplates({ onApplyTemplate }) {
    const templates = [
        {
            name: "File Processor",
            description: "Process files with input/output options",
            icon: FileText,
            framework: "click",
            color: "from-blue-500 to-blue-600",
            config: {
                name: "file-processor",
                description: "Process files with various options",
                framework: "click",
                arguments: [
                    { name: "input_file", help: "Input file to process", required: true, type: "str" }
                ],
                options: [
                    { name: "output", help: "Output file path", default: "", required: false, type: "str" },
                    { name: "format", help: "Output format", default: "txt", required: false, type: "str" },
                    { name: "verbose", help: "Enable verbose output", default: false, required: false, type: "bool" }
                ]
            }
        },
        {
            name: "Data Converter",
            description: "Convert between data formats",
            icon: Database,
            framework: "typer",
            color: "from-purple-500 to-purple-600",
            config: {
                name: "data-converter",
                description: "Convert data between different formats",
                framework: "typer",
                arguments: [
                    { name: "source", help: "Source file path", required: true, type: "str" }
                ],
                options: [
                    { name: "target", help: "Target file path", default: "", required: false, type: "str" },
                    { name: "from_format", help: "Source format (csv, json, xml)", default: "csv", required: false, type: "str" },
                    { name: "to_format", help: "Target format (csv, json, xml)", default: "json", required: false, type: "str" }
                ]
            }
        },
        {
            name: "System Monitor",
            description: "Monitor system resources",
            icon: Terminal,
            framework: "click",
            color: "from-emerald-500 to-emerald-600",
            config: {
                name: "sys-monitor",
                description: "Monitor system resources and performance",
                framework: "click",
                arguments: [],
                options: [
                    { name: "interval", help: "Update interval in seconds", default: "5", required: false, type: "int" },
                    { name: "cpu", help: "Monitor CPU usage", default: true, required: false, type: "bool" },
                    { name: "memory", help: "Monitor memory usage", default: true, required: false, type: "bool" },
                    { name: "disk", help: "Monitor disk usage", default: false, required: false, type: "bool" }
                ]
            }
        },
        {
            name: "Batch Downloader",
            description: "Download files from URLs",
            icon: Download,
            framework: "argparse",
            color: "from-orange-500 to-orange-600",
            config: {
                name: "batch-downloader",
                description: "Download multiple files from a list of URLs",
                framework: "argparse",
                arguments: [
                    { name: "url_file", help: "File containing URLs to download", required: true, type: "str" }
                ],
                options: [
                    { name: "output_dir", help: "Output directory", default: "./downloads", required: false, type: "str" },
                    { name: "threads", help: "Number of download threads", default: "4", required: false, type: "int" },
                    { name: "timeout", help: "Request timeout in seconds", default: "30", required: false, type: "int" }
                ]
            }
        }
    ];

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    Quick Start Templates
                </CardTitle>
                <p className="text-sm text-slate-600">
                    Start with a pre-built CLI template
                </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                    {templates.map((template, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${template.color} bg-opacity-10 flex-shrink-0`}>
                                        <template.icon className="w-4 h-4 text-slate-700" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-slate-900">{template.name}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {template.framework}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-600">{template.description}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onApplyTemplate(template.config)}
                                    className="hover:bg-slate-100 flex-shrink-0 ml-3"
                                >
                                    Use Template
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}