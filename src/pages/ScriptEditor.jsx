import React, { useState, useEffect } from "react";
import { Script } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
    Save,
    Play,
    Code2,
    Terminal,
    ArrowLeft,
    Plus,
    X,
    FileText,
    Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScriptEditor() {
    const navigate = useNavigate();
    const [script, setScript] = useState({
        name: "",
        description: "",
        code: "",
        category: "utilities",
        tags: [],
        is_cli_tool: false,
        cli_framework: "none",
        requirements: [],
        is_favorite: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newTag, setNewTag] = useState("");
    const [newRequirement, setNewRequirement] = useState("");

    // Get script ID from URL params if editing
    const urlParams = new URLSearchParams(window.location.search);
    const scriptId = urlParams.get('id');

    useEffect(() => {
        if (scriptId) {
            loadScript(scriptId);
        }
    }, [scriptId]);

    const loadScript = async (id) => {
        setIsLoading(true);
        try {
            const scriptData = await Script.list();
            const foundScript = scriptData.find(s => s.id === id);
            if (foundScript) {
                setScript(foundScript);
            }
        } catch (error) {
            console.error("Error loading script:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (scriptId) {
                await Script.update(scriptId, script);
            } else {
                await Script.create(script);
            }
            navigate(createPageUrl("Dashboard"));
        } catch (error) {
            console.error("Error saving script:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const addTag = () => {
        if (newTag && !script.tags.includes(newTag)) {
            setScript(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setScript(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const addRequirement = () => {
        if (newRequirement && !script.requirements.includes(newRequirement)) {
            setScript(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement("");
        }
    };

    const removeRequirement = (reqToRemove) => {
        setScript(prev => ({
            ...prev,
            requirements: prev.requirements.filter(req => req !== reqToRemove)
        }));
    };

    const getCodeTemplate = (category) => {
        const templates = {
            cli_tools: `#!/usr/bin/env python3
"""
CLI Tool Template
"""
import click

@click.command()
@click.option('--name', prompt='Your name', help='Name to greet.')
@click.option('--count', default=1, help='Number of greetings.')
def hello(count, name):
    """Simple program that greets NAME for a total of COUNT times."""
    for _ in range(count):
        click.echo(f'Hello, {name}!')

if __name__ == '__main__':
    hello()
`,
            automation: `#!/usr/bin/env python3
"""
Automation Script Template
"""
import os
import time
from pathlib import Path

def main():
    """Main automation function"""
    print("Starting automation task...")
    
    # Your automation logic here
    
    print("Automation task completed!")

if __name__ == '__main__':
    main()
`,
            data_processing: `#!/usr/bin/env python3
"""
Data Processing Script Template
"""
import pandas as pd
import json

def process_data(input_file):
    """Process data from input file"""
    # Load data
    if input_file.endswith('.csv'):
        df = pd.read_csv(input_file)
    elif input_file.endswith('.json'):
        with open(input_file, 'r') as f:
            data = json.load(f)
        df = pd.DataFrame(data)
    
    # Process data here
    
    return df

def main():
    """Main function"""
    input_file = "data.csv"  # Update this
    result = process_data(input_file)
    print(f"Processed {len(result)} records")

if __name__ == '__main__':
    main()
`,
            web_scraping: `#!/usr/bin/env python3
"""
Web Scraping Script Template
"""
import requests
from bs4 import BeautifulSoup
import time

def scrape_website(url):
    """Scrape data from website"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract data here
    
    return soup

def main():
    """Main function"""
    url = "https://example.com"
    data = scrape_website(url)
    print("Scraping completed!")

if __name__ == '__main__':
    main()
`
        };
        return templates[category] || `#!/usr/bin/env python3
"""
Python Script Template
"""

def main():
    """Main function"""
    print("Hello, World!")

if __name__ == '__main__':
    main()
`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton className="h-96 rounded-xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-64 rounded-xl" />
                            <Skeleton className="h-32 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
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
                                {scriptId ? 'Edit Script' : 'Create New Script'}
                            </h1>
                            <p className="text-slate-600">
                                {scriptId ? 'Modify your Python script' : 'Build and organize your Python code'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="shadow-sm hover:shadow-md transition-all duration-200"
                            onClick={() => setScript(prev => ({ ...prev, code: getCodeTemplate(script.category) }))}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Use Template
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving || !script.name || !script.code}
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? 'Saving...' : scriptId ? 'Update' : 'Save'}
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Code2 className="w-5 h-5 text-indigo-600" />
                                    Script Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Script Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="Enter script name..."
                                            value={script.name}
                                            onChange={(e) => setScript(prev => ({ ...prev, name: e.target.value }))}
                                            className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select
                                            value={script.category}
                                            onValueChange={(value) => setScript(prev => ({ ...prev, category: value }))}
                                        >
                                            <SelectTrigger className="border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="automation">Automation</SelectItem>
                                                <SelectItem value="data_processing">Data Processing</SelectItem>
                                                <SelectItem value="web_scraping">Web Scraping</SelectItem>
                                                <SelectItem value="utilities">Utilities</SelectItem>
                                                <SelectItem value="cli_tools">CLI Tools</SelectItem>
                                                <SelectItem value="analysis">Analysis</SelectItem>
                                                <SelectItem value="testing">Testing</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what this script does..."
                                        value={script.description}
                                        onChange={(e) => setScript(prev => ({ ...prev, description: e.target.value }))}
                                        className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 h-24"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Code Editor */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-emerald-600" />
                                        Python Code
                                    </div>
                                    <Link to={createPageUrl(`ExecutionHub?script=${scriptId || 'new'}`)}>
                                        <Button variant="outline" size="sm" className="hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                                            <Play className="w-3 h-3 mr-1" />
                                            Test Run
                                        </Button>
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <Textarea
                                    placeholder="Enter your Python code here..."
                                    value={script.code}
                                    onChange={(e) => setScript(prev => ({ ...prev, code: e.target.value }))}
                                    className="font-mono text-sm border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 min-h-[400px] resize-none"
                                    spellCheck={false}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Settings */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="text-lg">Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="font-medium">Favorite Script</Label>
                                        <p className="text-sm text-slate-600">Add to favorites for quick access</p>
                                    </div>
                                    <Switch
                                        checked={script.is_favorite}
                                        onCheckedChange={(checked) => setScript(prev => ({ ...prev, is_favorite: checked }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="font-medium">CLI Tool</Label>
                                        <p className="text-sm text-slate-600">Enable CLI functionality</p>
                                    </div>
                                    <Switch
                                        checked={script.is_cli_tool}
                                        onCheckedChange={(checked) => setScript(prev => ({ ...prev, is_cli_tool: checked }))}
                                    />
                                </div>
                                {script.is_cli_tool && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cli_framework">CLI Framework</Label>
                                        <Select
                                            value={script.cli_framework}
                                            onValueChange={(value) => setScript(prev => ({ ...prev, cli_framework: value }))}
                                        >
                                            <SelectTrigger className="border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="click">Click</SelectItem>
                                                <SelectItem value="typer">Typer</SelectItem>
                                                <SelectItem value="argparse">Argparse</SelectItem>
                                                <SelectItem value="none">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="text-lg">Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add tag..."
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                                        className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                    />
                                    <Button variant="outline" size="icon" onClick={addTag}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {script.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                                            {tag}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-4 h-4 ml-1 hover:bg-slate-300"
                                                onClick={() => removeTag(tag)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader className="p-6">
                                <CardTitle className="text-lg">Requirements</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Package name..."
                                        value={newRequirement}
                                        onChange={(e) => setNewRequirement(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                                        className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                    />
                                    <Button variant="outline" size="icon" onClick={addRequirement}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {script.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                            <span className="font-mono text-sm">{req}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-6 h-6"
                                                onClick={() => removeRequirement(req)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}