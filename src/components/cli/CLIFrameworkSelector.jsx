import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Terminal, Zap, Settings, Check } from "lucide-react";

export default function CLIFrameworkSelector({ selectedFramework, onFrameworkChange }) {
    const frameworks = [
        {
            id: "click",
            name: "Click",
            description: "Python composable command line interface toolkit",
            icon: Terminal,
            pros: ["Decorator-based", "Type validation", "Rich help system"],
            cons: ["Extra dependency"],
            color: "from-blue-500 to-blue-600",
            recommended: true
        },
        {
            id: "typer",
            name: "Typer",
            description: "Modern CLI framework based on Python type hints",
            icon: Zap,
            pros: ["Type hints", "Auto completion", "Modern syntax"],
            cons: ["Newer library"],
            color: "from-purple-500 to-purple-600",
            recommended: false
        },
        {
            id: "argparse",
            name: "Argparse",
            description: "Built-in Python argument parsing library",
            icon: Settings,
            pros: ["No dependencies", "Standard library", "Flexible"],
            cons: ["More verbose", "Less features"],
            color: "from-green-500 to-green-600",
            recommended: false
        }
    ];

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="text-lg">Framework Info</CardTitle>
                <p className="text-sm text-slate-600">
                    Learn about the selected CLI framework
                </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    {frameworks
                        .filter(fw => fw.id === selectedFramework)
                        .map((framework) => (
                            <div key={framework.id} className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${framework.color} bg-opacity-10`}>
                                        <framework.icon className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900">{framework.name}</h3>
                                            {framework.recommended && (
                                                <Badge className="bg-emerald-100 text-emerald-800 text-xs">
                                                    Recommended
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600">{framework.description}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-700 mb-2">Advantages</h4>
                                        <ul className="space-y-1">
                                            {framework.pros.map((pro, index) => (
                                                <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}