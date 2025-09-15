import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Upload,
    Rocket,
    BookOpen,
    Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
    const actions = [
        {
            title: "Import Scripts",
            description: "Upload Python files from your system",
            icon: Upload,
            color: "from-blue-500 to-blue-600",
            action: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.py';
                input.multiple = true;
                input.click();
            }
        },
        {
            title: "Quick Execute",
            description: "Run a script without saving",
            icon: Zap,
            color: "from-emerald-500 to-emerald-600",
            link: createPageUrl("ExecutionHub")
        },
        {
            title: "CLI Template",
            description: "Start with a CLI boilerplate",
            icon: Rocket,
            color: "from-purple-500 to-purple-600",
            link: createPageUrl("CLIBuilder")
        },
        {
            title: "Documentation",
            description: "Learn about script management",
            icon: BookOpen,
            color: "from-amber-500 to-amber-600",
            action: () => window.open("https://docs.python.org/3/", "_blank")
        }
    ];

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <p className="text-slate-600">Streamline your workflow with these shortcuts</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action, index) => (
                        <div key={index}>
                            {action.link ? (
                                <Link to={action.link}>
                                    <Button
                                        variant="outline"
                                        className="w-full h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300"
                                    >
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} bg-opacity-10`}>
                                            <action.icon className="w-6 h-6 text-slate-700" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-slate-900">{action.title}</div>
                                            <div className="text-xs text-slate-600 mt-1">{action.description}</div>
                                        </div>
                                    </Button>
                                </Link>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200 border-slate-200 hover:border-slate-300"
                                    onClick={action.action}
                                >
                                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} bg-opacity-10`}>
                                        <action.icon className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-slate-900">{action.title}</div>
                                        <div className="text-xs text-slate-600 mt-1">{action.description}</div>
                                    </div>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}