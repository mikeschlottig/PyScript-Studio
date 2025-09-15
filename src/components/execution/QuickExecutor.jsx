import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    Zap,
    Play,
    Code2,
    Square
} from "lucide-react";

export default function QuickExecutor({ quickCode, onCodeChange, onExecute, isExecuting }) {
    const codeExamples = [
        {
            name: "Hello World",
            code: `print("Hello, World!")
print("Current time:", __import__('datetime').datetime.now())`
        },
        {
            name: "Math Operations",
            code: `import math

# Basic calculations
numbers = [1, 2, 3, 4, 5]
print(f"Sum: {sum(numbers)}")
print(f"Average: {sum(numbers) / len(numbers)}")
print(f"Square root of 16: {math.sqrt(16)}")`
        },
        {
            name: "List Processing",
            code: `# List comprehension example
numbers = range(1, 11)
squares = [x**2 for x in numbers]
evens = [x for x in numbers if x % 2 == 0]

print(f"Numbers: {list(numbers)}")
print(f"Squares: {squares}")
print(f"Even numbers: {evens}")`
        }
    ];

    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Quick Execute
                </CardTitle>
                <p className="text-sm text-slate-600">
                    Run Python code without saving as a script
                </p>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Python Code</span>
                        <div className="flex gap-1">
                            {codeExamples.map((example, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onCodeChange(example.code)}
                                    className="text-xs h-7 px-2 hover:bg-slate-100"
                                >
                                    {example.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Enter Python code to execute quickly..."
                        value={quickCode}
                        onChange={(e) => onCodeChange(e.target.value)}
                        className="font-mono text-sm border-slate-200 focus:border-purple-300 focus:ring-purple-200 h-32 resize-none"
                        spellCheck={false}
                    />
                </div>

                <Button
                    onClick={onExecute}
                    disabled={!quickCode.trim() || isExecuting}
                    className={`w-full ${
                        isExecuting
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    } shadow-md hover:shadow-lg transition-all duration-200`}
                >
                    {isExecuting ? (
                        <>
                            <Square className="w-4 h-4 mr-2" />
                            Stop Execution
                        </>
                    ) : (
                        <>
                            <Zap className="w-4 h-4 mr-2" />
                            Quick Execute
                        </>
                    )}
                </Button>

                <div className="text-xs text-slate-500 space-y-1">
                    <p>• Execute Python code instantly without saving</p>
                    <p>• Perfect for testing snippets and quick calculations</p>
                    <p>• Output appears in the main execution panel</p>
                </div>
            </CardContent>
        </Card>
    );
}