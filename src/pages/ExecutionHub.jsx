import React, { useState, useEffect, useRef } from "react";
import { Script } from "@/api/entities";
import { ExecutionResult } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
    Play,
    Square,
    ArrowLeft,
    Terminal,
    Code2,
    Clock,
    Zap,
    AlertCircle,
    CheckCircle,
    Settings,
    History
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import ScriptSelector from "../components/execution/ScriptSelector";
import ExecutionOutput from "../components/execution/ExecutionOutput";
import ExecutionHistory from "../components/execution/ExecutionHistory";
import QuickExecutor from "../components/execution/QuickExecutor";

export default function ExecutionHub() {
    const [selectedScript, setSelectedScript] = useState(null);
    const [scripts, setScripts] = useState([]);
    const [executionResults, setExecutionResults] = useState([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionOutput, setExecutionOutput] = useState("");
    const [executionError, setExecutionError] = useState("");
    const [executionTime, setExecutionTime] = useState(0);
    const [scriptArgs, setScriptArgs] = useState([]);
    const [quickCode, setQuickCode] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    const executionStartTime = useRef(null);
    const outputRef = useRef(null);

    // Get script ID from URL params if provided
    const urlParams = new URLSearchParams(window.location.search);
    const scriptId = urlParams.get('script');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (scriptId && scripts.length > 0) {
            const script = scripts.find(s => s.id === scriptId);
            if (script) {
                setSelectedScript(script);
            }
        }
    }, [scriptId, scripts]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [scriptsData, resultsData] = await Promise.all([
                Script.list("-updated_date"),
                ExecutionResult.list("-created_date", 50)
            ]);
            setScripts(scriptsData);
            setExecutionResults(resultsData);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const executeScript = async (scriptToExecute = selectedScript, args = scriptArgs) => {
        if (!scriptToExecute) return;

        setIsExecuting(true);
        setExecutionOutput("");
        setExecutionError("");
        setExecutionTime(0);
        executionStartTime.current = Date.now();

        try {
            // Prepare the execution prompt
            let prompt = `Execute this Python script and return the output:\n\n${scriptToExecute.code}`;
            
            if (args.length > 0) {
                prompt += `\n\nScript arguments: ${args.join(' ')}`;
            }

            prompt += `\n\nPlease execute the script and return the output. If there are any errors, include them in the error field.`;

            const response = await InvokeLLM({
                prompt: prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        output: { type: "string", description: "Standard output from script execution" },
                        error: { type: "string", description: "Error output if any" },
                        success: { type: "boolean", description: "Whether execution was successful" }
                    }
                }
            });

            const endTime = Date.now();
            const executionTimeMs = endTime - executionStartTime.current;
            const executionTimeSec = executionTimeMs / 1000;

            setExecutionTime(executionTimeSec);
            setExecutionOutput(response.output || "");
            setExecutionError(response.error || "");

            // Save execution result
            await ExecutionResult.create({
                script_id: scriptToExecute.id,
                output: response.output || "",
                error: response.error || "",
                execution_time: executionTimeSec,
                status: response.success ? "success" : "error",
                args: args
            });

            // Update last executed timestamp
            await Script.update(scriptToExecute.id, {
                ...scriptToExecute,
                last_executed: new Date().toISOString()
            });

            // Reload data to refresh history
            loadData();

        } catch (error) {
            const endTime = Date.now();
            const executionTimeSec = (endTime - executionStartTime.current) / 1000;
            
            setExecutionTime(executionTimeSec);
            setExecutionError(error.message || "Execution failed");
            
            if (scriptToExecute.id) {
                await ExecutionResult.create({
                    script_id: scriptToExecute.id,
                    output: "",
                    error: error.message || "Execution failed",
                    execution_time: executionTimeSec,
                    status: "error",
                    args: args
                });
            }
        } finally {
            setIsExecuting(false);
        }
    };

    const executeQuickCode = async () => {
        if (!quickCode.trim()) return;

        const quickScript = {
            id: "quick-exec",
            name: "Quick Execution",
            code: quickCode,
            description: "Quick code execution"
        };

        await executeScript(quickScript, []);
    };

    const stopExecution = () => {
        setIsExecuting(false);
    };

    const addArgument = () => {
        setScriptArgs([...scriptArgs, ""]);
    };

    const updateArgument = (index, value) => {
        const newArgs = [...scriptArgs];
        newArgs[index] = value;
        setScriptArgs(newArgs);
    };

    const removeArgument = (index) => {
        setScriptArgs(scriptArgs.filter((_, i) => i !== index));
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
                                Execution Hub
                            </h1>
                            <p className="text-slate-600">
                                Run and monitor your Python scripts in real-time
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {selectedScript && (
                            <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
                                {selectedScript.name}
                            </Badge>
                        )}
                        <Button
                            onClick={() => executeScript()}
                            disabled={isExecuting || (!selectedScript && !quickCode)}
                            className={`${
                                isExecuting
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                            } shadow-lg hover:shadow-xl transition-all duration-200`}
                        >
                            {isExecuting ? (
                                <>
                                    <Square className="w-4 h-4 mr-2" />
                                    Stop
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Execute
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Panel - Script Selection & Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        <ScriptSelector
                            scripts={scripts}
                            selectedScript={selectedScript}
                            onSelectScript={setSelectedScript}
                            isLoading={isLoading}
                        />

                        {selectedScript && (
                            <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
                                <CardHeader className="p-6">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Settings className="w-5 h-5 text-indigo-600" />
                                        Execution Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <Label className="font-medium">Script Arguments</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={addArgument}
                                            >
                                                Add Arg
                                            </Button>
                                        </div>
                                        {scriptArgs.length === 0 ? (
                                            <p className="text-sm text-slate-500 italic">No arguments configured</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {scriptArgs.map((arg, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            placeholder={`Argument ${index + 1}`}
                                                            value={arg}
                                                            onChange={(e) => updateArgument(index, e.target.value)}
                                                            className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeArgument(index)}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {selectedScript.requirements && selectedScript.requirements.length > 0 && (
                                        <div>
                                            <Label className="font-medium">Dependencies</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {selectedScript.requirements.map((req, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {req}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <QuickExecutor
                            quickCode={quickCode}
                            onCodeChange={setQuickCode}
                            onExecute={executeQuickCode}
                            isExecuting={isExecuting}
                        />
                    </div>

                    {/* Right Panel - Output & History */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="output" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 bg-slate-100/60 p-1 rounded-xl">
                                <TabsTrigger value="output" className="rounded-lg font-medium">
                                    <Terminal className="w-4 h-4 mr-2" />
                                    Execution Output
                                </TabsTrigger>
                                <TabsTrigger value="history" className="rounded-lg font-medium">
                                    <History className="w-4 h-4 mr-2" />
                                    Execution History
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="output">
                                <ExecutionOutput
                                    output={executionOutput}
                                    error={executionError}
                                    executionTime={executionTime}
                                    isExecuting={isExecuting}
                                    selectedScript={selectedScript}
                                />
                            </TabsContent>

                            <TabsContent value="history">
                                <ExecutionHistory
                                    executionResults={executionResults}
                                    scripts={scripts}
                                    isLoading={isLoading}
                                    onSelectScript={setSelectedScript}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}