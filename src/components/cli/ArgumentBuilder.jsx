import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Terminal, Settings } from "lucide-react";

export default function ArgumentBuilder({ 
    title, 
    description, 
    items, 
    onAdd, 
    onUpdate, 
    onRemove, 
    type 
}) {
    return (
        <Card className="border-0 shadow-sm bg-white/60 backdrop-blur-sm">
            <CardHeader className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            {type === "argument" ? (
                                <Terminal className="w-5 h-5 text-emerald-600" />
                            ) : (
                                <Settings className="w-5 h-5 text-indigo-600" />
                            )}
                            {title}
                        </CardTitle>
                        <p className="text-slate-600 mt-1">{description}</p>
                    </div>
                    <Button
                        onClick={onAdd}
                        size="sm"
                        className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add {type === "argument" ? "Argument" : "Option"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            {type === "argument" ? (
                                <Terminal className="w-8 h-8 text-slate-400" />
                            ) : (
                                <Settings className="w-8 h-8 text-slate-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            No {type === "argument" ? "Arguments" : "Options"} Yet
                        </h3>
                        <p className="text-slate-600 mb-4">
                            Add {type === "argument" ? "positional arguments" : "optional flags"} to your CLI tool
                        </p>
                        <Button
                            onClick={onAdd}
                            variant="outline"
                            className="border-slate-200 hover:border-slate-300"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add First {type === "argument" ? "Argument" : "Option"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium text-slate-900">
                                        {type === "argument" ? "Argument" : "Option"} #{index + 1}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(index)}
                                        className="hover:bg-red-100 hover:text-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`${type}-name-${index}`}>
                                            {type === "argument" ? "Argument" : "Option"} Name
                                        </Label>
                                        <Input
                                            id={`${type}-name-${index}`}
                                            placeholder={type === "argument" ? "filename" : "verbose"}
                                            value={item.name}
                                            onChange={(e) => onUpdate(index, 'name', e.target.value)}
                                            className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor={`${type}-help-${index}`}>Help Text</Label>
                                        <Input
                                            id={`${type}-help-${index}`}
                                            placeholder="Description of this parameter"
                                            value={item.help || ""}
                                            onChange={(e) => onUpdate(index, 'help', e.target.value)}
                                            className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                        />
                                    </div>
                                    
                                    {type === "option" && (
                                        <div className="space-y-2">
                                            <Label htmlFor={`option-default-${index}`}>Default Value</Label>
                                            <Input
                                                id={`option-default-${index}`}
                                                placeholder="Default value (optional)"
                                                value={item.default || ""}
                                                onChange={(e) => onUpdate(index, 'default', e.target.value)}
                                                className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="font-medium">Required</Label>
                                            <p className="text-sm text-slate-600">
                                                Must be provided by user
                                            </p>
                                        </div>
                                        <Switch
                                            checked={item.required || false}
                                            onCheckedChange={(checked) => onUpdate(index, 'required', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}