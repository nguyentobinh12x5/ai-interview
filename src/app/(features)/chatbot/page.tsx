"use client";

import { Button } from "@/components/ui/button";
import { menuSuggestionFlow } from "./genkit";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [menuItem, setMenuItem] = useState<string>("");

  async function getMenuItem(formData: FormData) {
    const theme = formData.get("theme")?.toString() ?? "";
    const suggestion = await menuSuggestionFlow(theme);
    setMenuItem(suggestion);
  }

  return (
    <div>
      <form action={getMenuItem}>
        <Label htmlFor="theme">
          Suggest a menu item for a restaurant with this theme:
        </Label>
        <Input type="text" name="theme" id="theme" />
        <Button type="submit">Generate</Button>
      </form>
      <pre>{menuItem}</pre>
    </div>
  );
}
