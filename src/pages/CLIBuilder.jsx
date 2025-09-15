import React, { useState, useEffect } from "react";
import { Script } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
    Terminal,
    Plus,
    X,
    Save,
    Copy,
    ArrowLeft,
    Wand2,
    Code2,
    Play,
    Settings
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CLIFrameworkSelector from "../components/cli/CLIFrameworkSelector";
import ArgumentBuilder from "../components/cli/ArgumentBuilder";
import CodePreview from "../components/cli/CodePreview";
import CLITemplates from "../components/cli/CLITemplates";

export default function CLIBuilder() {
    const navigate = useNavigate();
    const [cliConfig, setCLIConfig] = useState({
        name: "",
        description: "",
        framework: "click",
        arguments: [],
        options: [],
        commands: []
    });
    const [generatedCode, setGeneratedCode] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        generateCode();
    }, [cliConfig]);

    const generateCode = () => {
        let code = "";
        
        switch (cliConfig.framework) {
            case "click":
                code = generateClickCode();
                break;
            case "typer":
                code = generateTyperCode();
                break;
            case "argparse":
                code = generateArgparseCode();
                break;
            default:
                code = generateClickCode();
        }
        
        setGeneratedCode(code);
    };

    const generateClickCode = () => {
        let code = `#!/usr/bin/env python3
"""
${cliConfig.description || "CLI Tool built with Click"}
"""
import click

@click.command()`;

        // Add options
        cliConfig.options.forEach(option => {
            const defaultValue = option.default ? `, default='${option.default}'` : '';
            const required = option.required ? ", required=True" : '';
            const helpText = option.help ? `, help='${option.help}'` : '';
            
            code += `\n@click.option('--${option.name}'${defaultValue}${required}${helpText})`;
        });

        // Add arguments
        cliConfig.arguments.forEach(arg => {
            const required = arg.required ? ", required=True" : '';
            code += `\n@click.argument('${arg.name.toUpperCase()}'${required})`;
        });

        // Function signature
        const params = [
            ...cliConfig.arguments.map(arg => arg.name.toLowerCase()),
            ...cliConfig.options.map(opt => opt.name.toLowerCase())
        ];
        
        code += `\ndef ${(cliConfig.name || 'main').toLowerCase().replace(/[^a-z0-9]/g, '_')}(${params.join(', ')}):\n`;
        code += `    """${cliConfig.description || 'Main CLI function'}"""\n`;
        code += `    # Your CLI logic here\n`;
        
        // Example usage of parameters
        params.forEach(param => {
            code += `    click.echo(f"${param}: {${param}}")\n`;
        });

        code += `\nif __name__ == '__main__':\n`;
        code += `    ${(cliConfig.name || 'main').toLowerCase().replace(/[^a-z0-9]/g, '_')}()\n`;

        return code;
    };

    const generateTyperCode = () => {
        let code = `#!/usr/bin/env python3
"""
${cliConfig.description || "CLI Tool built with Typer"}
"""
import typer
from typing import Optional

app = typer.Typer()

@app.command()
def ${(cliConfig.name || 'main').toLowerCase().replace(/[^a-z0-9]/g, '_')}(\n`;

        // Add arguments and options
        const params = [];
        
        cliConfig.arguments.forEach(arg => {
            const paramType = arg.required ? "str" : "Optional[str] = None";
            params.push(`    ${arg.name.toLowerCase()}: ${paramType}`);
        });
        
        cliConfig.options.forEach(option => {
            const defaultValue = option.default ? `"${option.default}"` : "None";
            const helpText = option.help ? `, help="${option.help}"` : "";
            params.push(`    ${option.name.toLowerCase()}: Optional[str] = typer.Option(${defaultValue}${helpText})`);
        });

        code += params.join(',\n') + '\n):\n';
        code += `    """${cliConfig.description || 'Main CLI function'}"""\n`;
        code += `    # Your CLI logic here\n`;
        
        // Example usage of parameters
        [...cliConfig.arguments, ...cliConfig.options].forEach(param => {
            code += `    typer.echo(f"${param.name}: {${param.name.toLowerCase()}}")\n`;
        });

        code += `\nif __name__ == "__main__":\n`;
        code += `    app()\n`;

        return code;
    };

    const generateArgparseCode = () => {
        let code = `#!/usr/bin/env python3
"""
${cliConfig.description || "CLI Tool built with argparse"}
"""
import argparse

def main():
    parser = argparse.ArgumentParser(description='${cliConfig.description || 'CLI Tool'}')
    
    # Add arguments\n`;

        cliConfig.arguments.forEach(arg => {
            const required = arg.required ? "" : ", nargs='?'";
            const helpText = arg.help ? `, help='${arg.help}'` : "";
            code += `    parser.add_argument('${arg.name.toLowerCase()}'${required}${helpText})\n`;
        });

        cliConfig.options.forEach(option => {
            const defaultValue = option.default ? `, default='${option.default}'` : "";
            const required = option.required ? ", required=True" : "";
            const helpText = option.help ? `, help='${option.help}'` : "";
            code += `    parser.add_argument('--${option.name}'${required}${defaultValue}${helpText})\n`;
        });

        code += `    
    args = parser.parse_args()
    
    # Your CLI logic here\n`;

        [...cliConfig.arguments, ...cliConfig.options].forEach(param => {
            code += `    print(f"${param.name}: {args.${param.name.toLowerCase()}}")\n`;
        });

        code += `\nif __name__ == '__main__':\n`;
        code += `    main()\n`;

        return code;
    };

    const addArgument = () => {
        setCLIConfig(prev => ({
            ...prev,
            arguments: [...prev.arguments, {
                name: "",
                help: "",
                required: true,
                type: "str"
            }]
        }));
    };

    const addOption = () => {
        setCLIConfig(prev => ({
            ...prev,
            options: [...prev.options, {
                name: "",
                help: "",
                default: "",
                required: false,
                type: "str"
            }]
        }));
    };

    const updateArgument = (index, field, value) => {
        setCLIConfig(prev => ({
            ...prev,
            arguments: prev.arguments.map((arg, i) => 
                i === index ? { ...arg, [field]: value } : arg
            )
        }));
    };

    const updateOption = (index, field, value) => {
        setCLIConfig(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => 
                i === index ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const removeArgument = (index) => {
        setCLIConfig(prev => ({
            ...prev,
            arguments: prev.arguments.filter((_, i) => i !== index)
        }));
    };

    const removeOption = (index) => {
        setCLIConfig(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const saveAsScript = async () => {
        setIsSaving(true);
        try {
            const scriptData = {
                name: cliConfig.name || "Untitled CLI Tool",
                description: cliConfig.description,
                code: generatedCode,
                category: "cli_tools",
                is_cli_tool: true,
                cli_framework: cliConfig.framework,
                requirements: cliConfig.framework === "click" ? ["click"] : cliConfig.framework === "typer" ? ["typer"] : [],
                tags: ["cli", "generated", cliConfig.framework]
            };
            
            await Script.create(scriptData);
            navigate(createPageUrl("Dashboard"));
        } catch (error) {
            console.error("Error saving CLI tool:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
    };

    const applyTemplate = (template) => {
        setCLIConfig(template);
        setSelectedTemplate(template);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={createPageUrl("Dashboard")}>
                            <Button variant="outline" size="icon" className="shadow-sm hover:shadow-md transition-all duration-200">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                                CLI Tool Builder
                            </h1>
                            <p className="text-slate-600">
                                Create powerful command-line interfaces with ease
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Code
                        </Button>
                        <Button
                            onClick={saveAsScript}
                            disabled={isSaving || !cliConfig.name}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save CLI Tool'}
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Configuration Panel */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Basic Settings */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Settings className="w-5 h-5 text-indigo-600" />
                                    CLI Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cli-name">Tool Name</Label>
                                    <Input
                                        id="cli-name"
                                        placeholder="my-cli-tool"
                                        value={cliConfig.name}
                                        onChange={(e) => setCLIConfig(prev => ({ ...prev, name: e.target.value }))}
                                        className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cli-description">Description</Label>
                                    <Textarea
                                        id="cli-description"
                                        placeholder="What does your CLI tool do?"
                                        value={cliConfig.description}
                                        onChange={(e) => setCLIConfig(prev => ({ ...prev, description: e.target.value }))}
                                        className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="framework">Framework</Label>
                                    <Select
                                        value={cliConfig.framework}
                                        onValueChange={(value) => setCLIConfig(prev => ({ ...prev, framework: value }))}
                                    >
                                        <SelectTrigger className="border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="click">Click (Recommended)</SelectItem>
                                            <SelectItem value="typer">Typer (Modern)</SelectItem>
                                            <SelectItem value="argparse">Argparse (Built-in)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Templates */}
                        <CLITemplates onApplyTemplate={applyTemplate} />

                        {/* Framework Info */}
                        <CLIFrameworkSelector 
                            selectedFramework={cliConfig.framework}
                            onFrameworkChange={(framework) => setCLIConfig(prev => ({ ...prev, framework }))}
                        />
                    </div>

                    {/* Argument Builder */}
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="arguments" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3 bg-slate-100/60 p-1 rounded-xl">
                                <TabsTrigger value="arguments" className="rounded-lg font-medium">
                                    Arguments
                                </TabsTrigger>
                                <TabsTrigger value="options" className="rounded-lg font-medium">
                                    Options
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="rounded-lg font-medium">
                                    Code Preview
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="arguments">
                                <ArgumentBuilder
                                    title="Positional Arguments"
                                    description="Required parameters that users must provide"
                                    items={cliConfig.arguments}
                                    onAdd={addArgument}
                                    onUpdate={updateArgument}
                                    onRemove={removeArgument}
                                    type="argument"
                                />
                            </TabsContent>

                            <TabsContent value="options">
                                <ArgumentBuilder
                                    title="Options & Flags"
                                    description="Optional parameters with default values"
                                    items={cliConfig.options}
                                    onAdd={addOption}
                                    onUpdate={updateOption}
                                    onRemove={removeOption}
                                    type="option"
                                />
                            </TabsContent>

                            <TabsContent value="preview">
                                <CodePreview 
                                    code={generatedCode}
                                    framework={cliConfig.framework}
                                    onCopy={copyToClipboard}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}