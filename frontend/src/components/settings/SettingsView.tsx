import * as React from "react";
import { Check, Eye, EyeOff, KeyRound, Moon, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { models } from "@/data/mock";
import { cn } from "@/lib/utils";

function MaskedKeyInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type={visible ? "text" : "password"}
          defaultValue={placeholder}
          className="px-9 font-mono text-xs"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={visible ? "Hide key" : "Show key"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { id: "light" as const, label: "Light", icon: Sun },
    { id: "dark" as const, label: "Dark", icon: Moon },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage API keys, model preferences, and appearance.
          </p>
        </div>

        <div className="space-y-6">
          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">API Keys</CardTitle>
              <CardDescription>
                Keys are masked and mocked — nothing is sent anywhere.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MaskedKeyInput
                label="OpenAI API Key"
                placeholder="sk-proj-0000000000000000000000000000"
              />
              <MaskedKeyInput
                label="Anthropic API Key"
                placeholder="sk-ant-0000000000000000000000000000"
              />
              <div className="flex justify-end">
                <Button size="sm">Save keys</Button>
              </div>
            </CardContent>
          </Card>

          {/* Model preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Model Preferences</CardTitle>
              <CardDescription>
                Defaults applied to new chats and comparisons.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Default model</Label>
                <div className="flex flex-wrap gap-2">
                  {models.map((m, i) => (
                    <button
                      key={m.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                        i === 0
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Stream responses</p>
                  <p className="text-xs text-muted-foreground">
                    Show tokens as they are generated.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Always cite sources</p>
                  <p className="text-xs text-muted-foreground">
                    Include citations from the knowledge base.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Appearance</CardTitle>
              <CardDescription>
                Choose how the interface looks. Dark is the default.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:max-w-sm">
                {themeOptions.map((opt) => {
                  const active = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium transition-colors",
                        active
                          ? "border-primary/50 bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                      {active && (
                        <Check className="ml-auto h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
